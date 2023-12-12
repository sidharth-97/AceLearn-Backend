import { liveClassInterface } from "../infrastructure/database/liveClassModel";
import LiveClassRepository from "../infrastructure/repository/liveClassRepository";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import studentRepository from "../infrastructure/repository/studentRepository";
import { sendNotification } from "../infrastructure/utils/sendNotifications";
import * as schedule from "node-schedule";

import { jobMap } from "../adaptor/scheduleController";
class LiveClassUsecase {
  private liveClassRepo: LiveClassRepository;
  private paymentRepo: PaymentRepository;
  private studentRepo: studentRepository;
  constructor(
    liveClassRepo: LiveClassRepository,
    paymentRepo: PaymentRepository,
    studentRepo: studentRepository
  ) {
    (this.liveClassRepo = liveClassRepo),
      (this.paymentRepo = paymentRepo),
      (this.studentRepo = studentRepo);
  }
  async createLiveClass(data: liveClassInterface) {
    const save = await this.liveClassRepo.save(data);
    console.log(save, "save is here");

    if (save) {
      return {
        status: 200,
        data: save,
      };
    } else {
      return {
        status: 401,
        data: "Not saved",
      };
    }
  }
  async listAllClass() {
    const classes = await this.liveClassRepo.find();
    if (classes) {
      return {
        status: 200,
        data: classes,
      };
    } else {
      return {
        status: 404,
        data: "No class avilable",
      };
    }
  }
  async registerLiveclass(data: { student: string; id: string }) {
    try {
      const classes = await this.liveClassRepo.findById(data.id);
      console.log(classes, "this is the classes");

      if (classes) {
        const isStudentRegistered = classes.students.includes(data.student);

        if (!isStudentRegistered) {
          classes.students.push(data.student);

          const save = await this.liveClassRepo.save(classes);
          console.log(save, "this is the save");

          if (save) {
            const student = await this.studentRepo.findById(data.student);

            const notificationDate = new Date(
              classes.date.getTime() - 30 * 60 * 1000
            );
            const jobName = Date.now().toString();

            const job = schedule.scheduleJob(notificationDate, async () => {
              await sendNotification(student?.token);
            });

            jobMap.set(jobName, job);

            return {
              status: 200,
              data: { ...save, notificationScheduled: true },
            };
          } else {
            return {
              status: 500,
              data: "Internal Server Error",
            };
          }
        } else {
          return {
            status: 400,
            data: "Student is already registered for this class",
          };
        }
      } else {
        return {
          status: 404,
          data: "Live class not found",
        };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        status: 500,
        data: "Internal Server Error",
      };
    }
  }
}

export default LiveClassUsecase;
