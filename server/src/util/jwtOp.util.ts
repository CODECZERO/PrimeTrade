import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

const genAccToken = async (user: TokenPayload): Promise<string> => {
    const secret = process.env.JWT_ACCESS_SECRET || 'access_secret';
    const expiresIn = process.env.JWT_ACCESS_EXPIRY || '1d';
    
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        secret,
        { expiresIn } as any
    );
};

const genRefToken = async (user: TokenPayload): Promise<string> => {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    const expiresIn = process.env.JWT_REFRESH_EXPIRY || '10d';
    
    return jwt.sign(
        {
            id: user.id
        },
        secret,
        { expiresIn } as any
    );
};

const verifyAccToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret');
};

const verifyRefToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
};

export { genAccToken, genRefToken, verifyAccToken, verifyRefToken };
