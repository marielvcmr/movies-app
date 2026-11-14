import { Component, input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

export type ButtonVariant = 'primary' | 'outline' | 'danger';

// Reusable app button. The label goes between the tags:
// <app-button type="submit" icon="arrow-forward" [disabled]="!canSubmit()">Log in</app-button>
// The page that passes `icon` must register it with addIcons().
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [IonButton, IonIcon],
  host: { '[class]': "'variant-' + variant()" },
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  icon = input<string>(); // ionicon shown at the right edge, e.g. 'arrow-forward'
}
