import type {Request, Response} from "express";

export async function Upload(req: Request<{}, {}, Uint8Array>, res: Response<{length: number}>): Promise<void>
{
    const {body} = req;
    const {length} = body;
    console.log(body);
    res.json({length});
}