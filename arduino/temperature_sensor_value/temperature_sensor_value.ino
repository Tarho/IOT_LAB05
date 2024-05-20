#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Vux";
const char* password = "tttt18032001";

const char* server = "http://192.168.195.144:8080/api/addTempurateSenSorValue";

WiFiClient wificlient;

#define DHTPIN D5
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const int boardId = 1;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void measureAndSendData() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["board_id"] = 1;
  String payload;

  serializeJson(doc, payload);

  HTTPClient http;

  http.begin(wificlient, server);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode == 200) {
    String response = http.getString();
    DynamicJsonDocument json(10000);
    deserializeJson(json, response);
    Serial.println(response);
  }
  else {
    Serial.print("Http post request failed, error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  delay(5000);
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  while (!Serial) delay(1);

  setup_wifi();
}

void loop() {
  measureAndSendData();
}
