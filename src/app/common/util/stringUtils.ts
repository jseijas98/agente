export default class StringUtils{

    public convertDate(arrayDate: Array<number>):string{

        let dateNull:string = "null";   

        if(arrayDate == null){return dateNull}
            return `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]} ${arrayDate[3]}:${arrayDate[4]}:${arrayDate[5]}`;

    }

}
