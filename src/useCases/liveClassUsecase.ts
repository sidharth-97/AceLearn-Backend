import { liveClassInterface } from "../infrastructure/database/liveClassModel";
import LiveClassRepository from "../infrastructure/repository/liveClassRepository";

class LiveClassUsecase{
    private liveClassRepo: LiveClassRepository;
    constructor(liveClassRepo: LiveClassRepository) {
        this.liveClassRepo=liveClassRepo
    }
    async createLiveClass(data:liveClassInterface) {
        const save = await this.liveClassRepo.save(data)
        if (save) {
            return {
                status: 200,
                data:save
            }
        } else {
            return {
                status: 401,
                data:"Not saved"
            }
        }
    }
}

export default LiveClassUsecase