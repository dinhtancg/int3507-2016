import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChange,
         trigger, state, style, transition, animate
       } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NativeService } from '../../services/native.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'reading-page',
  templateUrl: 'build/pages/reading/reading.html',
  providers: [ NativeService ],
  inputs: [ 'curWord', 'allWords' ],
  animations: [
    trigger('answerState', [
      state('right',   style({
        backgroundColor: '#2196f3',
        color: 'white',
      })),
      state('wrong',   style({
        backgroundColor: '#f44336',
        color: 'white',
        borderColor: '#f44336',
      })),
    ])
  ]
})

export class ReadingPage implements OnInit, OnChanges {
  // Biến trả về cho fighting, khi đúng thì gọi hàm next()
  @Output() onCorrect = new EventEmitter<boolean>();
  allWords: Object[];
  curWord: Object;
  answers: Object[] = [];

  constructor(private nativeService: NativeService, private helperService: HelperService) { }

  ngOnInit() { }

  ngOnChanges(changes:{[propKey: string]: SimpleChange}) {
    let NO_OF_ANS = 4;
    if (this.allWords.length < NO_OF_ANS) {
      NO_OF_ANS = this.allWords.length;
    }

    // Tạo mảng các từ sai
    let wrongWord = [];
    for (let i = 0; i < this.allWords.length; i++) {
      if (this.curWord['id'] != this.allWords[i]['id']) {
        wrongWord.push(this.allWords[i]);
      }
    }

    // Random vị trí từ đúng
    let position = this.helperService.random(NO_OF_ANS);

    // Tạo mảng các câu trả lời
    this.answers = [];

    for (let i = 0; i < NO_OF_ANS; i++) {
      if (i == position) {
        let temp = {};
        temp['id'] = this.curWord['id'];
        temp['content'] = this.curWord['content'];
        this.answers.push(temp);

        // this.answers.push(this.curWord);
      } else {
        let r = this.helperService.random(wrongWord.length);
         
        let temp = {};
        temp['id'] = wrongWord[r]['id'];
        temp['content'] = wrongWord[r]['content'];
        this.answers.push(temp);

        // this.answers.push(wrongWord[r]);
        wrongWord.splice(r, 1);
      }
    }
  }

  checkAnswer(item: Object) {
    if (item['id'] == this.curWord['id']) {
      setTimeout(() => {
        this.onCorrect.emit(true);
      }, 1000);
  
      item['state'] = 'right';
      this.nativeService.playAudio('correct');
      this.nativeService.tts(this.curWord['content']);
    } else {
      item['state'] = 'wrong';
      this.nativeService.playAudio('wrong');
    }
  }
}
