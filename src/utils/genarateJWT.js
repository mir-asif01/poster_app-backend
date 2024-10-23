import jwt from "jsonwebtoken"

function genarateJwtToken(id, email) {
    const token = jwt.sign(
        {
            _id: id,
            email: email,
        },
        process.env.JWT_SECRET,
    )
    return token
}

export default genarateJwtToken