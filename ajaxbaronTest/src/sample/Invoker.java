package sample;

import com.web2driver.abaron.server.AbaronServiceServer;

public class Invoker {
	public static void main(String[] args) {

		// サービスオブジェクトを生成
		AmazonGwService amazonGwService = new AmazonGwService();

		// サービスサーバオブジェクトを生成(ポート番号8080番)
		AbaronServiceServer serviceServer = new AbaronServiceServer(8080);

		// サービスサーバにゲートウェイサービスオブジェクトを追加
		serviceServer.addGatewayService(amazonGwService, "booksearch");

		// ドキュメントルートを c:/amazon に設定。 c:/amazon/index.html以下にある場合
		serviceServer.setDocumentRoot("D:/CTC松村/labo/workspace/ajaxbaronTest/war");
		// サービスサーバを起動し、サービスを開始
		serviceServer.startServer();
	}
}
