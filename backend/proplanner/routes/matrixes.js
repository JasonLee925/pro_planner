var express = require("express");
var router = express.Router();
const authorise = require("./auth");


/**
 * @swagger
 * tags:
 *   name: Matrixes
 *   description: Example operations
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search matrixes
 *     description: Search matrixes. This is will NOT return `details`.
 *     tags: [Matrixes]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: archived
 *         schema:
 *           type: integer
 *         description: 0 (exclude archived matrixes) or 1 (include archived matrixes)
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/search", authorise, async (req, res) => {
    const limit = req.query.limit ? req.query.limit : 10;
    const archived = req.query.archived 
    const user_id = req.token.userId;
    if (user_id === null) {
        return res.status(400).json({error: true, message: "invalid token: user id not found"})
    }

    try {
        const result = await req.db.from("matrixes").select()
                                .where("archive", "<=", archived )
                                .andWhere("user_id", "=", user_id)
                                .orderBy('create_time', 'desc').limit(limit);
        const matrix = result
        res.json({ matrix })
    } catch(error) {
        res.status(500).json({error:true, message: error.message})
    }
});

/**
 * @swagger
 * /latest:
 *   get:
 *     summary: Get Latest Matrix
 *     description: Get the latest matrix
 *     tags: [Matrixes]
 *     parameters:
 *       - in: query
 *         name: details
 *         schema:
 *           type: integer
 *         description: 0 (without details) or 1 (with details)
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/latest", authorise, async (req, res) => {
    const isDetails = req.query.details == 1;
    const user_id = req.token.userId;
    if (user_id === null) {
        return res.status(400).json({error: true, message: "invalid token: user id not found"})
    }

    let result = await req.db.from("matrixes").select().andWhere("user_id", "=", user_id).orderBy('create_time', 'desc').limit(1)
    const id = result[0].id
    const matrix = result[0]

    let details;
    if (isDetails) {
        result = await req.db.from("matrix_details").select().where("id", "=", id)
        details = result[0]
    }

    res.json({ matrix, details });
});

/**
 * @swagger
 * /:id:
 *   get:
 *     summary: Get A Matrix 
 *     description: Get matrix by id.
 *     tags: [Matrixes]
*     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: matrix id
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/:id", authorise, async (req, res) => {
    const id = req.params.id;
    const isDetails = req.query.details == 1;

    let result = await req.db.from("matrixes").select().where("id", "=", id)
    const matrix = result[0]

    let details;
    if (isDetails) {
        result = await req.db.from("matrix_details").select().where("id", "=", id)
        details = result[0]
    }

    res.json({ matrix, details });
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create A Matrix 
 *     description: Create a matrix
 *     tags: [Matrixes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               do:
 *                 type: string
 *               schedule:
 *                 type: string
 *               delegate:
 *                 type: string
 *               delete:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post("/", authorise, async (req, res) => {
    const tx = await req.db.transaction();
    const user_id = req.token.userId;
    if (user_id === null) {
        return res.status(400).json({error: true, message: "invalid token: user id not found"})
    }

    try {
        const create_time = new Date();
        const result = await tx("matrixes").insert({ create_time, user_id });
        const matrixId = result[0]

        const insertedData = {
            id: matrixId,
            do: req.body.do,
            schedule: req.body.schedule,
            delegate: req.body.delegate,
            delete: req.body.delete,
        };
        await tx("matrix_details").insert({ ...insertedData });

        await tx.commit();
        res.json({ id: matrixId });
    } catch (error) {
        await tx.rollback();
        res.status(500).json({error:true, message: error})
    } finally {
        // await req.db.destroy();
    }

});

/**
 * @swagger
 * /:id:
 *   put:
 *     summary: Update A Matrix 
 *     description: Get matrix by id.
 *     tags: [Matrixes]
*     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: matrix id
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put("/:id", authorise, async (req, res) => { 
    const id = req.params.id;
    const archive = req.query.archive == 1? 1 : 0;
    
    const result = await req.db.from('matrixes').where("id", "=", id).update({ archive })

    res.json({ data: result[0]})
});

/**
 * @swagger
 * /:id/details:
 *   put:
 *     summary: Update Matrix Detail 
 *     description: Update a matrix's details.
 *     tags: [Matrixes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: matrix id
*     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               do:
 *                 type: string
 *               schedule:
 *                 type: string
 *               delegate:
 *                 type: string
 *               delete:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put("/:id/details", authorise, async (req, res) => { 
    const id = req.params.id;
    
    const updatedData = {}
    if (req.body.do) updatedData.do = req.body.do;
    if (req.body.schedule) updatedData.schedule = req.body.schedule;
    if (req.body.delegate) updatedData.delegate = req.body.delegate;
    if (req.body.delete) updatedData.delete = req.body.delete;
    
    const result = await req.db.from('matrix_details').where("id", "=", id).update({ ...updatedData })

    res.json({ data: result[0] })
});



module.exports = router;
