import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  canvas: fabric.Canvas;
  savedposition;
  hasPermissions: boolean = true;
  infos = ['info 1\n...\n....', 'info 2\n...\n....', 'info 3\n...\n....'];
  

  ngOnInit() {
    this.setCanvas('myCanvas');
    this.createInterface(); 
  }

  setCanvas(canvas: string) {
    this.canvas = new fabric.Canvas(canvas);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.setSelectionOptions();
    this.canvas.on('object:modified', function(options) {
      if (options.target) {
        this.savedposition = this.toJSON();
      }
    });
    this.canvas.on('mouse:dblclick', function(options) {
      if (options.target) {
        let group : fabric.Group = <fabric.Group>options.target;
        let textBlock : fabric.Text = <fabric.Text>group.getObjects()[1];
        console.log('You have double clicked on\n ', textBlock.text);
      }
    });
  }
 
  createInterface() {
    if ( !this.savedposition ) {
      this.createAllBoxes();
      console.log('new');
      return;
    }
    this.load();
    this.updateInfos();
    console.log('alt');
    
  }

  updateInfos() {
    this.infos.forEach( (info, index) => {
      let group : fabric.Group = <fabric.Group>this.canvas.getObjects()[index];
      let textBlock : fabric.Text = <fabric.Text>group.getObjects()[1];
      textBlock.text = info;
      this.canvas.renderAll();
    });
  }

  createAllBoxes() {
    let i = 0;
    this.infos.forEach( info => {
      this.createBox(info, i);
      i = i + 150;
      
    });
  }
  createBox(info: string, i: number) {
    const rect = this.createRect();
    const text = this.createText(info);
    const group = new fabric.Group([ rect, text ], {
      left: 0 + i,
      top: 0 + i,
      
    });
    this.setPermissions(group, this.hasPermissions);
    this.canvas.add(group);
  }

  createText(text) {
    return new fabric.Text(text, {
      fontStyle: 'italic',
      fontFamily: 'Hoefler Text',
      fontSize: 30,
      lineHeight: 0.7,
      shadow: 'rgba(0,0,0,0.3) 5px 5px 5px',
      stroke: '#ffffff',
      strokeWidth: 1,
      fill: 'white',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
  }

  createRect() {
    let rect = new fabric.Rect({ 
      width: 300, 
      height: 200, 
      fill: 'green',
      stroke: '#ffffff',
      strokeWidth: 1,
      shadow: 'rgba(0,0,0,0.3) 5px 5px 5px',
      originX: 'center',
      originY: 'center' });

    rect.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: rect.width,
      y2: 0,
      colorStops: {
        0: "red",
        1: "blue"
      }
    });

    rect.on('selected', function() {
      console.log('selected a rectangle');
    });
    
    return rect;
  }

  
  save(){
    this.savedposition = this.canvas.toJSON();
    console.log(JSON.stringify(this.savedposition));
  }

  load() {
    this.canvas.loadFromJSON(this.savedposition,this.canvas.renderAll.bind(this.canvas));
  }

  setSelectionOptions() {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 15,
      padding: 10
  });
  }

  changeBackground() {
    this.canvas.setBackgroundImage('https://www.jensen-media.de/wp-content/uploads/2018/06/edeka_goerse_01.jpg', 
    this.canvas.renderAll.bind(this.canvas));
  }

  setPermissions(group: fabric.Group, bool: boolean) {
    group.lockMovementX = !bool;
    group.lockMovementY = !bool;
    group.lockRotation = !bool;
    group.lockScalingFlip = !bool;
    group.lockScalingX = !bool;
    group.lockScalingY = !bool;
    group.lockUniScaling = !bool;
    fabric.Object.prototype.selectable = bool;
  }


  setOverLay() {
    this.canvas.setOverlayImage('http://www.photos-public-domain.com/wp-content/uploads/2012/05/bright-red-paper-texture.jpg', 
    this.canvas.renderAll.bind(this.canvas), {
    opacity: 0.3
    });
  }
}