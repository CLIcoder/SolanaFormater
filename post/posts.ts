import { Request, Response } from 'express';
import { getMintData } from '../helper/index';



const getMint = async (req: Request, res: Response) => {
    // get the post id from the req.params
    let response: any = await getMintData()
    console.log('ok')
    // return response
    return res.status(200).json(response);
};


export default { getMint };
