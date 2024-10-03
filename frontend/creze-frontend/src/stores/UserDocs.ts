import { makeAutoObservable } from 'mobx';



class UserDocsStore {
    files = [] as unknown as File;
    filesName = [];

    constructor() {
        makeAutoObservable(this);
    }

    setFilesUser(file:any){
        // @ts-ignore
        this.files.push(file);
    }
    setFilesUserName(file:string){
        // @ts-ignore
        this.filesName.push(file);
    }

    removeFilesUser(nameFile: string) {
        // @ts-ignore
        this.filesName = this.filesName.filter((file: { name: string; }) => file !== nameFile);
        this.files = this.files.filter((file: { name: string; }) => file.name !== nameFile);

        console.log(this.filesName, 'name')
        console.log(this.files, 'files')
    }

    clearFilesUser(){
        this.filesName = []
        this.files = [] as unknown as File;

    }

}

const useDocsStores = new UserDocsStore();
export default useDocsStores;
