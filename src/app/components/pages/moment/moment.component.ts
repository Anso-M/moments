import { Component, OnInit } from '@angular/core';
import { Moment } from '../../../interfaces/Moment';
import { MomentService } from '../../../services/moment/moment.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessagesService } from '../../../services/messages/messages.service';
import { Comment } from '../../../interfaces/Comment';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment/comment.service';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css'
})
export class MomentComponent implements OnInit {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;
  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(
    private momentService: MomentService, 
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get("id"));

      this.momentService
      .getMoment(id)
      .subscribe((item) => (this.moment = item.data));

      this.commentForm = new FormGroup({
        text: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required])
      })
  }

  get text() {
    return this.commentForm.get("text")!;
  }

  get username() {
    return this.commentForm.get("username")!;
  }

  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe();

    this.messagesService.add("Momento excluído com sucesso!");

    this.router.navigate(['/']);
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if(this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService
    .createComment(data)
    .subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesService.add("Comentário adicionado!");

    // reseta o form
    this.commentForm.reset();

    formDirective.resetForm();
  }
}
