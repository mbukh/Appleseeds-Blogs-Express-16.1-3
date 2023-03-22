const confirmOwner = expressAsyncHandler(async (model) => {
    const originalDoc = await model.findById(req.params.id);
    if (!originalDoc) {
        res.status(resCodes.NOT_FOUND);
        throw new Error("Post update id not found.");
    }

    const postedBy = originalDoc.postedBy.valueOf();
    if (postedBy !== req.user.id) {
        res.status(resCodes.FORBIDDEN);
        throw new Error("Post update available for authors only.");
    }
});

export default confirmOwner;
