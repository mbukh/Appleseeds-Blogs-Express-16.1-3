import resCodes from "../constants/resCodes";

const advancedUpdateHandler = (model, method) => async (req, res, next) => {
    let doc = await model.findById(req.params.id);

    if (!doc) {
        res.status(resCodes.NOT_FOUND);
        throw new Error(`Resource with id ${req.params.id} not found`);
    }

    const owner = doc.postedBy.valueOf();

    if (owner !== req.user.id) {
        res.status(resCodes.FORBIDDEN);
        throw new Error("Resource action restricted for current user.");
    }

    if (method === "PUT") {
        doc = await model.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
        });
    }

    if (method === "DELETE") {
        doc.deleteOne();
    }

    res.status(200).json({
        success: true,
        data: doc,
    });
};

export default advancedUpdateHandler;
