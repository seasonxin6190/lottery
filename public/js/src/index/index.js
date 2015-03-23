define(function(require, exports, module){
    var Pagex = require('pagex/pagex');
    var Button = require('index/button');
	exports.init = function(){
		Pagex.render({
            areaId: '#indexContent',
            areaChild: '.content-page',
            speed: 0.5,
            nav: true,
            afterScroll: function(index){
                if(parseInt(index) == 3){
                  $("#rankingList").empty();
                    var luckid = $('#luckID').attr("data-id");
                   // console.log(luckid);
                    if(typeof(luckid) != 'undefined'){

                        $.get('/api/lottery/index/lotteryList',{lottery: luckid},function(data,status){
                            
                          if(data.status){
                            var lotteryData = data.rows;
                            var lotteryLen = lotteryData.length;
                            var level = [];
                                level = data.level;
                            var levelLen = level.length - 1;
                            var levelText = [];
                            var tempArr = [];
                            var lotteryStr = '', levelStr = '';
                           // console.log(level);
                            for(var j=0;j<=levelLen;j++){
                                
                                   levelStr = '<hr style="clear:both"><h3>'+level[j]['level']+'</h3><ul class="winner-list">';
                              //    tempArr[i] = level[j]['id']
                               for(var i=0;i<lotteryLen;i++){
                                     if(level[j]['id'] == lotteryData[i]['app_lottery_award_id']){
                                      //lotteryText[i]= '<li><h1 class="ranking-first">'+lotteryData[i]['name']+'</h1><ul class="ranking-first-name-list"><li><div><img class="img-responsive" src='+lotteryData[i]['photo']+' width="128" height="125"></div><div>'+lotteryData[i]['activity_user_id']+'</div></li><li><div class="next"><img src="/images/btn_03.png"></div></li></ul></li>'
                                       lotteryStr += '<li><img class="thumbnail" src='+lotteryData[i]['photo']+' width="128" height="125"><label>'+lotteryData[i]['name']+'</label></li>';
                                     }
                                }
                                levelText[j] = levelStr+lotteryStr+'</ul>';
                                lotteryStr = '';
                              //  console.log('text:'+levelText[j]);
                            }
                            
                          //  $("#rankingList").append(lotteryText.toString()); 
                          //  $("#rankingList").append(levelText.toString()); 
                            $("#rankingList").append(levelText.join('')); 
                          }
                        })
                    }
                }else{
                  $("#rankingList").empty();
                }
            }
        });
        Button.buttonEffect();
      //  Button.seat();
	}
})