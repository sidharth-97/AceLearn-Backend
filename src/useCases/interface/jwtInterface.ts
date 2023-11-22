

export default interface JWT{
    createJWT(studentId: string,role:string): string,
    verifyJWT(data:any):any
}