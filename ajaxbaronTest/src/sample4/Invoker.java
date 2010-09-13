package sample4;

import com.web2driver.abaron.server.AbaronServiceServer;

public class Invoker {

    public static void main(String[] args) {
        
        //サービスオブジェクトを生成
        InitTestService initTestService=new InitTestService();
        
        //サービスサーバオブジェクトを生成(ポート番号8080番)
        AbaronServiceServer serviceServer=new AbaronServiceServer(8080);
        
        //サービスサーバにサービスオブジェクトを追加
        serviceServer.addService(initTestService,"itest");
        
        //サービスサーバを起動し、サービスを開始
        serviceServer.startServer();
        
    }

}
