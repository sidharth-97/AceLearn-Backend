import Tutor from "../../entities/tutors";
import TutorRepositoryInterface from "../../useCases/interface/tutorRepositoryInterface";
import { TutorModel } from "../database/tutorModel";

class TutorRepository implements TutorRepositoryInterface{
   async findByEmail(email: string): Promise<any> {
        const tutor = await TutorModel.findOne({ email: email })
       if (tutor) {
           return tutor
       } else {
           return null 
       }
    }

     async save(tutor: Tutor): Promise<any> {
         const newTutor = new TutorModel(tutor)
         await newTutor.save()
         console.log("after save");
         
         return newTutor
    }
    async findAndUpdate(tutor: Tutor): Promise<any> {
        if (tutor._id) {
            const updatedTutor = await TutorModel.findByIdAndUpdate(tutor._id, tutor, { new: true })
            return updatedTutor
        }
    }
   async findById(id: string): Promise<any>{
       const tutor = await TutorModel.findById(id).populate("review.student")
       console.log(tutor,"got tutor");
       
       if (tutor) {
           return tutor
       } else {
           return null
       }
    }
    async findAll(data:{
        page:number,
        limit: number,
        subject:string,
        minFee?:number,
        maxFee?: number,
        searchQuery?: string,
        sortValue?:string
    }): Promise<any> {
        let query:any = {}
        if (data.subject && data.subject.length > 0) {
            let Data=data.subject.split(",")
            query.subject = { $in: Data };
        }
        if (data.searchQuery) {
            query.$or = [
                {name:{$regex:data.searchQuery,$options:'i'}}
            ]
        }
        if (data.minFee !== undefined && data.maxFee !== undefined) {
            query.fee={$gte:data.minFee,$lte:data.maxFee}
        }
        console.log(query, "query");
        
        const count=await TutorModel.countDocuments(query)
        let AllTutor = await TutorModel.find(query).skip((data.page - 1) * data.limit).limit(data.limit)
        
        if (data.sortValue == "low") {
            AllTutor=AllTutor.sort((a:any,b:any)=>a.fee-b.fee)
        } else if (data.sortValue == 'high') {
            AllTutor=AllTutor.sort((a:any,b:any)=>b.fee-a.fee)
        } else if (data.sortValue == "rating") {
            AllTutor=AllTutor.sort((a:any,b:any)=>b.rating-a.fee.rating)
        }
        
        if (AllTutor) {
            return { AllTutor,count }
        } else {
            return null
        }
    }
    async addReview(tutor: any, data: any) {
        const newReview = {
          student: data.student,
          rating: data.rating,
          description: data.description,
        };
      
        console.log(newReview, "new review");
      
        const existingIndex = tutor.review.findIndex(
          (item: any) => item.student == data.student
        );
      
        console.log(existingIndex, "existing index");
      
        if (existingIndex === -1) {
          tutor.review.push(newReview);
        } else {
          tutor.review[existingIndex] = { ...tutor.review[existingIndex], ...newReview };
        }
        
        const totalRating = tutor.review.reduce((sum: number, review: any) => sum + review.rating, 0);
        tutor.rating = totalRating / tutor.review.length;
      
        await tutor.save();
          
        return tutor;
      }
      
    async oldReview(tutor: any, student: string) {
        console.log(tutor, "1");
        console.log(student,"2");
        
        
        const existingIndex = tutor.review.findIndex((item: any) => item.student == student )
        if (existingIndex == -1) {
            return null
        } else {
            return tutor.review[existingIndex]
        }
      }
    async payTutor(tutor: any,fee:number) {
        const amount = parseInt(tutor.wallet)+fee
        tutor.wallet = amount

        tutor.notifications.push({
            title: "Amount credited",
            content: `An amount of ${fee} credited to your wallet`,
            type:"wallet"
        })
        tutor.walletHistory.push({
            title: "Tutor Fee",
            amount: fee,
            type: "Credit",
            details:`An amount of ${fee} credited to your wallet`
        })
        const updatedTutor = await tutor.save()
        if (updatedTutor) {
            return updatedTutor
        } else {
            return null
        }

    }
    async pushNotifications(id: string, title: string, content: string, type: string) {
        const tutor = await TutorModel.findById(id)
        if (tutor) {
            tutor.notifications.push({
                title,content,type
            })
            return tutor
        } else {
            return null
        }
    }

}

export default TutorRepository