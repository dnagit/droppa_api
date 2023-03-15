const index = async (req, res) => {
    try {
        // const result = await appService.index();
        res.status(200).send(``);
    } catch (e) {
        console.log('e', e);
        res.status(500).send(e.toString());
    }
};

export default { index };
