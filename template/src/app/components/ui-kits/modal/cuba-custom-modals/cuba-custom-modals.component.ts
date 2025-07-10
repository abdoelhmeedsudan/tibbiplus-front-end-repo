import { Component } from '@angular/core';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { ProfileModalComponent } from "../widgets/profile-modal/profile-modal.component";
import { ResultModalComponent } from "../widgets/result-modal/result-modal.component";

@Component({
  selector: 'app-cuba-custom-modals',
  imports: [CardComponent, ProfileModalComponent, ResultModalComponent],
  templateUrl: './cuba-custom-modals.component.html',
  styleUrl: './cuba-custom-modals.component.scss'
})

export class CubaCustomModalsComponent {

}
