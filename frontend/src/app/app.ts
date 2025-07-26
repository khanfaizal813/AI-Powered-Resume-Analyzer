import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadResume } from './components/upload-resume/upload-resume';
// import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadResume],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  // animations: [slideInAnimation]
})
export class App {
  protected title = 'Resume Analyzer';

  // prepareRoute(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  // }

}
