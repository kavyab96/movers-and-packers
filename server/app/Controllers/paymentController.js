
const getPayments = async (req, res ,next) => {
    try {     
      
        return res.status(200).json({
            message: "Provider earnings fetched successfully.",
        });
    } catch (error) {
        next(error);
    }
}

export {getPayments};