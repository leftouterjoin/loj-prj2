package sample3;

import com.web2driver.abaron.service.AbaronServiceBaseUnit;

/**
 * 戻り値Beanがネストされた構造を持つサンプル
 * 
 * EducationClassは１学級を、Studentは１人の生徒を表す
 * このサービスではcnt数の学級(EducationClass)を返す
 * 学級には複数(ここでは10人)の生徒(Student)が所属している
 * 
 * (extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class ComplexBeanService extends AbaronServiceBaseUnit {

    public ComplexBeanServiceOutput doExecute(ComplexBeanServiceInput in) {

        int cnt = in.getCnt();

        ComplexBeanServiceOutput out = new ComplexBeanServiceOutput();

        EducationClass[] educationClass = new EducationClass[cnt];
        for (int i = 0; i < cnt; i++) {
            educationClass[i] = new EducationClass();
            educationClass[i].setClassNum(i);

            Student[] student = new Student[10];
            for (int j = 0; j < 10; j++) {
                student[j] = new Student();
                student[j].setName("name-" + i + "-" + j);
                student[j].setAddress("addr-" + i + "-" + j);
            }
            educationClass[i].setStudent(student);

        }
        out.setEducationClass(educationClass);

        return out;
    }

}
