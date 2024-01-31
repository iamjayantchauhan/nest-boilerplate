import { Response } from 'express';

/**
 * Response Generator
 * @param {Response} response
 * @param {string} message
 * @param {Record<string, any>} data Response data
 * @returns
 */
export const responseGenerator = (
    response: Response,
    statusCode: number,
    message: string,
    data: Record<string, any>,
): Response => {
    return response.status(statusCode).json({
        message: message,
        data: data,
    });
};