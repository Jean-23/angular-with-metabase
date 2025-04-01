import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jwt from 'jsonwebtoken';
import {SignJWT} from 'jose';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'angular-with-metabase';
  private METABASE_SITE_URL = "http://metabase.recifaso.org";
  private METABASE_SECRET_KEY = "402aa3050db2d469d65c69a244fff06288112b4713e0fc688ccfb722383afacb";

  private payload = {
    resource: { dashboard: 12 },
    params: {},
    exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  };

  private sanitizer = inject(DomSanitizer);

  private token !:string;

  iframeUrl !:SafeResourceUrl;

  ngOnInit(): void {
    this.generateToken().then(
      () => {
        this.initIFrame();
      }
    );
  }

  private initIFrame() {
    const url = this.METABASE_SITE_URL + "/embed/dashboard/" + this.token +
      "#bordered=true&titled=true";
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async generateToken() {
    const secretKey = new TextEncoder().encode(this.METABASE_SECRET_KEY); // Remplace par ta clé
    this.token =  await new SignJWT(this.payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secretKey);
  }
}
