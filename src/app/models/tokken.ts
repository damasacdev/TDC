export class Tokken {
    public id:any;
    public username:string;
    public access_token:string;
    public name:string;
    public sitecode:string;
    public service_url:string;
    public hospital:string;  

    public dbtype=["Mysql","Sql Server","Oracle"];

    public dbconnect = [
        ['Host',"Username","Password","Port","3306","1","Mysql"],
        ['Host',"Username","Password","Port","3306","2","Sql Server"],
        ["Host","Username","Password","Port","1521","3","Oracle"]
        // {id:1,name:"Mysql", host:"Host Name",username:"Username", password:"Password", port:"Port"},
        // {id:2,name:"Sql Server", host:"Host Name",username:"Username", password:"Password", port:"Port"},
        // {id:3,name:"Oracle", username:"User", password:"Password", connectString:"connectString", externalAuth:"externalAuth"}
    ];
         
   // public tokkens:Array<{id:any, username:string, access_token:string,name:string,sitecode:string,service_url:string,hospital:string}>=[];
}