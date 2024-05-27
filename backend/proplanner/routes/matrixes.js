var express = require("express");
var router = express.Router();
const authorise = require("../auth");

/* Test. */
router.get("/test", authorise, (req, res) => {
    res.json({ successful: req.token });
});

/* Search matrixes. This is will NOT return `details`. */
router.get("/search", authorise, async (req, res) => {
    const limit = req.query.limit ? req.query.limit : 10;
    const archived = req.query.archived == 1
    
    try {
        const result = await req.db.from("matrixes").select().where("archive", "=", archived ? 1 : 0).orderBy('create_time', 'desc').limit(limit);
        const matrix = result
        res.json({ matrix })
    } catch(error) {
        res.status(500).json({error:true, message: error.message})
    }
});

/* Get the latest matrix. */
router.get("/latest", authorise, async (req, res) => {
    const isDetails = req.query.details == 1;

    let result = await req.db.from("matrixes").select().orderBy('create_time', 'desc').limit(1)
    const id = result[0].id
    const matrix = result[0]

    let details;
    if (isDetails) {
        result = await req.db.from("matrix_details").select().where("id", "=", id)
        details = result[0]
    }

    res.json({ matrix, details });
});

/* Get matrix by id. */
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

/* Create a matrix. */
router.post("/", authorise, async (req, res) => {
    const tx = await req.db.transaction();

    try {
        const create_time = new Date();
        const user_id = req.token.userId;
        if (user_id === null) {
            return res.status(400).json({error: true, message: "invalid token: user id not found"})
        }
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

/* Update a matrix. */
router.put("/:id", authorise, async (req, res) => { 
    const id = req.params.id;
    const archive = req.query.archive == 1? 1 : 0;
    
    const result = await req.db.from('matrixes').where("id", "=", id).update({ archive })

    res.json({ data: result[0]})
});


/* Update a matrix's details. */
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
