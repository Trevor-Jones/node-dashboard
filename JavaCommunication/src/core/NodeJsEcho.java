package core;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonBuilderFactory;
import javax.json.JsonObject;

public class NodeJsEcho {
	// socket object
	private Socket socket = null;


	public static void main(String[] args) throws UnknownHostException, IOException, ClassNotFoundException, InterruptedException {
		// class instance
		NodeJsEcho client = new NodeJsEcho();


		// socket tcp connection
		String ip = "localhost";
		int port = 3000;
		client.socketConnect(ip, port);
		
		// writes and receives the message
		for(int i = 0; i < 10000; i++) {
			int num = (int)(Math.random() * 100);
			
			JsonBuilderFactory factory = Json.createBuilderFactory(null);
			 JsonObject value = factory.createObjectBuilder()
			     .add("velocity", num)
			     .add("millis", System.currentTimeMillis())
			     .build();
			 String message = value.toString();
			 System.out.println(message);
			
//			String message = "<test><speed>5</speed><velocity>" + num + "</velocity><millis>" + System.currentTimeMillis() + "</millis></test>";
	
			System.out.println("Sending: " + message);
			String returnStr = client.echo(message);
			System.out.println("Receiving: " + returnStr);
			Thread.sleep(500);
		}
		
		client.closeSocket();
	}


	// make the connection with the socket
	private void socketConnect(String ip, int port) throws UnknownHostException, IOException {
		System.out.println("[Connecting to socket...]");
		this.socket = new Socket(ip, port);
	}


	// writes and receives the full message int the socket (String)
	public String echo(String message) {
		try {
			// out & in 
			PrintWriter out = new PrintWriter(getSocket().getOutputStream(), true);
			BufferedReader in = new BufferedReader(new InputStreamReader(getSocket().getInputStream()));


			// writes str in the socket and read
			out.println(message);
			String returnStr = in.readLine();
			return returnStr;


		} catch (IOException e) {
			e.printStackTrace();
		}


		return null;
	}

	public void closeSocket() throws IOException {
		socket.close();
	}

	// get the socket instance
	private Socket getSocket() {
		return socket;
	}
}