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
        try {
           const liveClass = new liveClassModel(data)
        const save = await liveClass.save()
        if (save) {
            return save
        } else {
            return null
        } 
        } catch (error) {
            console.log(error);
            
        }
        
    }
    async find(): Promise<any> {
       try {
         const classes = await liveClassModel.find({}).populate("tutor")
       if (classes) {
           return classes
       } else {
           return null
       }
       } catch (error) {
        console.log(error);
        
       }
      
    }
    async findByTutor(id: string): Promise<any> {
        const classes = await liveClassModel.find({ tutor: id })
        if (classes) {
            return classes
        } else {
            return null
        }
    }
    async deleteClass(id: string): Promise<any> {
  await liveClassModel.deleteOne({_id:id})
    }
}

export default LiveClassRepository