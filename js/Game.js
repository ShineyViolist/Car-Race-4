class Game {
  constructor(){
    this.image1 = loadImage("images/car1.png");
    this.image2 = loadImage("images/car2.png");
    this.image3 = loadImage("images/car3.png");
    this.image4 = loadImage("images/car4.png");
    this.trackImage = loadImage("images/track.jpg");
    this.groundImage = loadImage("images/ground.png");

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage(this.image1);

    car2 = createSprite(300,200);
    car2.addImage(this.image2);

    car3 = createSprite(500,200);
    car3.addImage(this.image3);

    car4 = createSprite(700,200);
    car4.addImage(this.image4);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    
    if(allPlayers !== undefined){

      background(this.groundImage);
      //imageMode(CENTER);
      image(this.trackImage,0,-displayHeight * 4,displayWidth - 200,displayHeight * 5);
      //console.log(displayHeight);
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 200;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        //console.log(cars[index - 1] + "index:" + index);
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(player.distance > 4200){
      gameState = 2;
      //console.log(player.distance);
    }

    if(keyIsDown(UP_ARROW) && player.index !== null && gameState == 1){
      player.distance +=10
      player.update();
    }

    drawSprites();
  }
}
