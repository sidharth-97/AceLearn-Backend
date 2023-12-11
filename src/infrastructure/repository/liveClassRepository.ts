import liveClassRepoInterface from "../../useCases/interface/liveClassRepoInterface";
import { liveClassModel } from "../database/liveClassModel";

class LiveClassRepository implements liveClassRepoInterface{
    async findById(id: string): Promise<any> {
        const classes = await liveClassModel.findById(id)
        if (classes) {
            return classes
        } else {
            return null
        }
    }

    async save(data: any): Promise<any> {
        const liveClass = new liveClassModel(data)
        const save = await liveClass.save()
        if (save) {
            return save
        } else {
            return null
        }
    }
}

export default LiveClassRepository