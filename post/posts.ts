/** source/controllers/posts.ts */
import { Request, Response } from 'express';
import { test } from '../helper/index';



// updating a post
const getMint = async (req: Request, res: Response) => {
    // get the post id from the req.params
    let id: string = req.params.id;
    let response: any = await test(id)
    console.log('ok')
    // return response
    return res.status(200).json(response);
};


export default { getMint };
