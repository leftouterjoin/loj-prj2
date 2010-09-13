package sample6;

public class ConfTestServiceInput {

    private double num1;
    private double num2;
   
    public double getNum1() {
        return num1;
    }
    public void setNum1(double num1) {
        this.num1 = num1;
    }
    public double getNum2() {
        return num2;
    }
    public void setNum2(double num2) {
        this.num2 = num2;
    }
    //about+プロパティ名 のメソッドはプロパティの説明を記述できます。 
    public String aboutNum1(){
    	return "割り算 num1/num2 の分子";
    }
    public String aboutNum2(){
    	return "割り算 num1/num2 の分母";
    }
    
}
