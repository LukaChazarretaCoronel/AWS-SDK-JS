const jwt = require("jsonwebtoken")

exports.lambda_handler = async (event) => {
    try {
        if (!event.headers?.Authorization) {
            return generateAuthResponse("user", "Deny", event.methodArn)
        }

        const token = event.headers.Authorization.split(' ')[1] // Fixed array access
        const secret = "$2a$10$uV4aOv7cC5nVZ6r2bgv7HedH9P2e1N.BJr9FJ6rBS6/VpQwFHxfy2" // Should be environment variable

        try {
            const decoded = jwt.verify(token, secret)
            return generateAuthResponse(decoded.sub, "Allow", event.methodArn)
        } catch(err) {
            console.error("JWT verification failed:", err)
            return generateAuthResponse("user", "Deny", event.methodArn)
        }
    } catch(err) {
        console.error("Authorization error:", err)
        return generateAuthResponse("user", "Deny", event.methodArn)
    }
}

function generateAuthResponse(principalId, effect, resource) { // Fixed function name
    const policyDocument = {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: effect,
                Resource: resource
            }
        ]
    }
    return {
        principalId,
        policyDocument
    }
}
