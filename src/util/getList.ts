import { Request, Response } from "express"
import { Repository } from "typeorm";


export async function getList<T>(repo: Repository<T>, req: Request, res: Response){
    try {
        const options:any={}
        if(req.query.sort){
            const [sortField="id", sortDirection="DESC"]=JSON.parse(req.query.sort as string);
            options.order={[sortField]: sortDirection}
        }
        if(req.query.range){
            const [first=0, last]=JSON.parse(req.query.range as string);
            options.skip=first;
            options.take=last - first;
        }
        

        const [result, total] = await repo.findAndCount(options)

        const first=options.skip || 0;
        const last=options.first + options.take;

        const resultCount=result.length;
        const realLastIndex = options.take ? Math.min(resultCount - 1 + first, last) : (resultCount - 1);

        
        res.set('Content-Range', `key ${first}-${realLastIndex}/${total}`)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        })
    }
}

export default getList