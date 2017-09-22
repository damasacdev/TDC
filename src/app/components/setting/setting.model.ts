
export class SettingModel {
   public dbtype=["Mysql","Microsoft Sql Server","Oracle","Postgres","Firebird"];
    public dbconnect = [
        ['Host',"Username","Password","Port","3306","1","Mysql"],
        ['Host',"Username","Password","Port","3306","2","Sql Server"],
        ["Host","Username","Password","Port","1521","3","Oracle"],
        ['Host',"Username","Password","Port","3306","1","Postgres"],
        ['Host',"Username","Password","Port","3306","1","Firebird"]
    ];
}