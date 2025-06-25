export const createBanner = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}