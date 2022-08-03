# Angular、Ng-Bootstrap サンプルページ

> AngularとNg-Bootstrap で作ったスマホ対応Webアプリです
> - Service Worker スマホ対応Webアプリ
> - Bootstrap レスポンシブデザイン
> - Bootstrap ナビゲーション
> - Angular ルーティング
> - Local Storage
> - [Angular Google Maps component](https://github.com/angular/components/tree/main/src/google-maps#readme)
> - サンプル集
>   - RGB色作成機能（色相を決め、彩度と明度を調整してRGBを作成する）
>   - [ツアー・オブ・ヒーローズ](https://angular.jp/tutorial)

## プロジェクト作成方法

```
最新パッケージで作り直す場合は、ng_bootstrap_sampleを一度消す

$ sudo npm install -g @angular/cli
$ sudo npm install -g npm@8.15.0
$ ng new ng_bootstrap_sample
$ cd ng_bootstrap_sample

$ ng add @ng-bootstrap/ng-bootstrap

Service Worker
$ ng add @angular/pwa

追加パッケージ
$ npm install angular-in-memory-web-api
$ npm install @angular/google-maps

コンポーネント追加例
$ ng generate component top
```

## 実行方法

> Service Worker は、`ng build`で起動する必要があります。  
> またangular/cliとnpmパッケージは、バージョンをキレイに合わせる必要があります。

```
$ npm install -g @angular/cli@13.3.5
$ cd ng_bootstrap_sample
$ npm install
$ ng serve
```

- http://localhost:4200/

## ビルド

```
$ ng build

$ sudo npm install -g http-server
$ http-server ./dist/ng_bootstrap_sample -p3000 -c-1
```

- http://localhost:3000/

## 参考文献

- Angular
  - [Angular Docs](https://angular.jp/docs)
  - [Angular2によるモダンWeb開発 基礎編](https://project.nikkeibp.co.jp/bnt/atcl/17/P96530/)
  - [AngularによるモダンWeb開発 基礎編 第2版](https://project.nikkeibp.co.jp/bnt/atcl/19/P54530/)
  - [Angular powered Bootstrap](https://ng-bootstrap.github.io/#/getting-started)
  - [Angular ツアー・オブ・ヒーローズ アプリケーションとチュートリアル](https://angular.jp/tutorial/toh-pt6)
- Bootstrap
  - [Bootstrap v5.0](https://getbootstrap.jp/docs/5.0/getting-started/introduction/)

## サーバー構築（CentOS Stream release 8）

> 動作環境
> - [WebARENA Indigo](https://web.arena.ne.jp/indigo/)
>   - 事前に以下で、Webサーバー環境を作っておく
>     - `01_Indigo.md`
>     - `02_Apache.md`
>     - `80_NodeJs.md`

> https://github.com/develop986/centos_server

### 動作環境構築

```
# npm install -g @angular/cli@13.3.5
# rm -rf ng_bootstrap_sample/
# git clone https://github.com/develop986/ng_bootstrap_sample
```

```
ビルドする場合は、更に以下を実施
trapsample
# cd ng_bootstrap_sample
# npm install
$ ng build
```

## サービス作成

```
  580  vi /etc/systemd/system/ngbootstrapsample.service
  581  cat /etc/systemd/system/ngbootstrapsample.service
  582  systemctl enable ngbootstrapsample.service
  583  systemctl start ngbootstrapsample.service
  584  systemctl stop ngbootstrapsample.service
  586  systemctl restart ngbootstrapsample.service

[root@centos ~]# cat /etc/systemd/system/ngbootstrapsample.service
[Unit]
Description=ngbootstrapsample server
After=syslog.target network.target

[Service]
Type=simple
ExecStart=/usr/bin/http-server /root/ng_bootstrap_sample/dist/ng_bootstrap_sample -p3001 -c-1
WorkingDirectory=/root/ng_bootstrap_sample
KillMode=process
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

### VirtualHost 設定

```
# vi /etc/httpd/conf/httpd.conf

以下のファイルを作成する

<VirtualHost *:80>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/html/
    ServerName ngbootstrapsample.mysv986.com
    ServerAlias ngbootstrapsample.mysv986.com
RewriteEngine on
RewriteCond %{SERVER_NAME} =ngbootstrapsample.mysv986.com
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

```
# systemctl restart httpd
# certbot --apache -d ngbootstrapsample.mysv986.com
# systemctl restart httpd
```

```
# vi /etc/httpd/conf/httpd-le-ssl.conf

Include以下に、SSLProxy設定を追記する。

<VirtualHost *:443>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/html/
    ServerName ngbootstrapsample.mysv986.com
    ServerAlias ngbootstrapsample.mysv986.com

SSLCertificateFile /etc/letsencrypt/live/ngbootstrapsample.mysv986.com/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/ngbootstrapsample.mysv986.com/privkey.pem
Include /etc/letsencrypt/options-ssl-apache.conf

    SSLEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    SSLProxyEngine on
    ProxyRequests off
    ProxyPass / http://ngbootstrapsample.mysv986.com:3001/
    ProxyPassReverse / http://ngbootstrapsample.mysv986.com:3001/
    
</VirtualHost>
```

```
# systemctl restart httpd
```

https://ngbootstrapsample.mysv986.com