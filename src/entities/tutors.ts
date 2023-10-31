export default interface Tutor{
    _id?: string,
    name:string,
    email: string,
    password: string,
    mobileNo: string,
    subject: Array<string>,
    fee: string
    image:string
    bio:string
}