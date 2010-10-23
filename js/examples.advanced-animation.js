var gridSize = 6;
$(window).addEvent('load',function(){

	var positionCoordinates = new Array();
	var currentSqrPositions = new Array();

	CANVAS.init({ canvasElement : 'canvas', interactive : true })	
	var layer = CANVAS.layers.add( new Layer({id : 'myLayer'}));	
	
CANVAS.addImage = function(layer, x, y, itemid) {

var foo = new CanvasItem({
           
            id : itemid,
            x : x,
            y : y,
            w : 50,
            h : 50,
            state : 'normal',
            scale : 1,
            interactive : true, //although they have no interactive events!
            colors : { normal : '#f00', hover : '#00f' },            
            events : {
                onDraw : function(ctx){
							 								 
                      ctx.save();
                      ctx.translate(this.x, this.y);
							 
							 var w = this.w * this.scale;
							 var h = this.h * this.scale;
 							 var x = this.x - w * .5;
                      var y = this.y - h * .5;
							 	
                     ctx.fillStyle = this.colors[this.state];
                     
                     ctx.fillRect(w * -0.5,h * -0.5,w,h);
       
                    	ctx.fillText('1',w,h);
                    	ctx.restore();
                     this.setDims(x,y,w,h);
                }
            }
            
        });
               
    CANVAS.layers.get('myLayer').add(foo);
    return foo;
	};

CANVAS.removeImage = function(layer, itemid) 				//function to remove objects
{
	 CANVAS.layers.get(layer).remove(CANVAS.layers.get('myLayer').get(itemid));
	 var sqrKey = itemid.split("_");
	 currentSqrPositions[sqrKey[1]] = "nill";
}


	CANVAS.layoutGrid = function()
	{
		
		var top_x = 25;      //Intial X & Y Coordinates
   	var top_y = 25;
   	
   	var grid_id = 0;
		var layoutRowNumber = gridSize - 1;
   	
   	var y_offset = 51;
   	var x_offset = 51;
   	
		for(i = 0; i < gridSize; i++)
		{
			 y_cord = top_y;
			 x_cord = top_x;	 
   		 for(j = 0; j < gridSize; j++)
   		   {  				 
 					positionCoordinates[grid_id] = x_cord + "," + y_cord;
					currentSqrPositions[grid_id] = "nill";   				
   				 
   				x_cord = x_cord + x_offset;
   				
					grid_id++;
				
				}
				top_y = top_y + y_offset;
		}	
	}
		
	CANVAS.layoutRow = function()
	{
 		var newSqrObjectRef = "";
		
		for(i=5;i>-1;i--)
		{
			for(j=i*gridSize; j<(i*gridSize)+gridSize; j++)
			{	
				if(currentSqrPositions[j] == "nill")
				{
					
					xycoord = positionCoordinates[j].split(",");
					
					x_cord = xycoord[0].toInt();
					y_cord = xycoord[1].toInt();
										
					sqrID = "sqr_"+j;
			
					newSqrObjectRef = CANVAS.addImage("myLayer", x_cord, y_cord, sqrID);
				}
				
				currentSqrPositions[j] = newSqrObjectRef;
			}
		}
	}

	CANVAS.reposition = function()													//REPOSITION FUCNTION - CURRENTCOINPOSITION
	{	

		for(i=((gridSize*gridSize)-gridSize); i<(gridSize*gridSize); i++)
		{
			for(j=i; j>=0; j-=gridSize)
			{
				if(currentSqrPositions[j] == "nill")
				{
					
					x=j;					
					x-=gridSize;
					while(x>=0)
					{
						if(currentSqrPositions[x] != "nill")
						{							
							var fromID = "sqr_"+x;
							var toID = "sqr_"+j;
							
							var sqrObjectRef = currentSqrPositions[x];
							currentSqrPositions[x] = "nill";
							currentSqrPositions[j] = sqrObjectRef;
							
							CANVAS.removeImage("myLayer", fromID );
							CANVAS.addImage("myLayer", sqrObjectRef.x, sqrObjectRef.y, toID);
							
							x = -1;
						}	
						x-=gridSize;
					}
				}
			}
		}
	}
	
   CANVAS.reanimate = function()
	{										
		for(i=0; i<(gridSize*gridSize); i++)
		{
			var cfn = currentSqrPositions[i];
			var xycoord = positionCoordinates[i].split(",");
			var x_cord_new = xycoord[0].toInt();
			var y_cord_new = xycoord[1].toInt();
			
			currentSqrPositions[i].x = x_cord_new.toInt();
			currentSqrPositions[i].y = y_cord_new.toInt();
			
			if(cfn != 'nill')
			{
				
				var x_cord = CANVAS.layers.get("myLayer").get("sqr_"+i).x.toInt();
				var y_cord = CANVAS.layers.get("myLayer").get("sqr_"+i).y.toInt();
				
				//CANVAS.layers.get("myLayer").get("sqr_"+i).y = y_cord_new;	//comment when using animation function.
			}
		}   	  
	}
		
   CANVAS.animateDown = function()
	{ 	
		console.log("calling animate down");
		for(i=0; i<(gridSize*gridSize); i++)		//loop initialized for animation of the sqrs to the new position.
		{	
			if(currentSqrPositions[i] != 'nill')
			{
				sqr = CANVAS.layers.get("myLayer").get("sqr_"+i);
				x1 = currentSqrPositions[i].x.toInt();
				y1 = currentSqrPositions[i].y.toInt();

				new Cmorph(sqr,
					  {
   		   	  	duration : 500,
   		   	  	transition : 'sine:out',
   		 		  }).morph({
   		   	  	x : x1,
   		   	  	y : y1
   		 		  });
 		  		console.log(sqr.x+","+sqr.y);
   		}

   	}
   }
	
	
$$('canvas').addEvents({ //adding native dom events to <canvas> element
    
	    mousedown : function(e){
	        this.store('down',true);
	        this.state = 'hover';
	        if( sqr = CANVAS.findTarget( CANVAS.getMouse(e) ) )
	            {
	                sqr.state = 'hover'; //set items state to hover if it is hit
	            }
	        
	    },
    
    mousemove : function(e){
        
        if(this.retrieve('down',false)){
            if( hoverItem = CANVAS.findTarget( CANVAS.getMouse(e) ) )
            {
                hoverItem.state = 'hover'; //set items state to hover if it is hit
            }
        }
        
    },
    
    mouseup : function(e){
        this.store('down',false);
        
        CANVAS.layers.get('myLayer').items.each(function(item){
            if(item.state == 'hover')
		        {
			        CANVAS.removeImage("myLayer", item.id );  //deleting selected images
				  }
			    
			  });
		 
		 CANVAS.reposition();
	    CANVAS.reanimate();
	    CANVAS.animateDown();
   }
    
}).store('down',false); //flag wether mouse is down or not stored in dom

	CANVAS.layoutGrid(gridSize);
		CANVAS.layoutRow();

        CANVAS.addThread(new Thread({
                id : 'myThread',
                onExec : function(){
                        CANVAS.clear().draw();
                }
        }));
});
