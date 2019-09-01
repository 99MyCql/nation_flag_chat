function question1(answer) {
  if (answer == '2') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        <b>五星红旗的礼仪</b>
        <br><br>
        《中华人民共和国国旗法》第十二条规定：国旗“应当早晨升起，傍晚降下”。这里的“应当”，就是“应该”和“理所当然”的意思。
        <br><br>
        《中华人民共和国国旗法》规定：为确保国旗的圣洁和完整，天安门广场上空的国旗基本上几天更换一面。每逢重大节日，必须更换新国旗。即使国旗不受损，悬挂的最长时间也不得超过10天。
        <br><br>
        中国的航空公司中只有中国国际航空公司可以在飞行器上喷绘中国国旗。
        </p>
      </li>
    `
  } else if (answer == '1') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="5.5">
        <h2 class="user7"></h2>
        <p>
        <b>五星红旗的设计内涵和制式规范</b>
        <br><br>
        中华人民共和国国旗为五星红旗，长方形，红色象征革命，其长与高为三与二之比，旗面左上方缀黄色五角星五颗，象征共产党领导下的革命大团结，星用黄色象征红色大地上呈现光明。
        <br><br>
        一星较大，其外接圆直径为旗高3/10，居左；四星较小，其外接圆直径为旗高1/10，环拱于大星之右侧，并各有一个角尖正对大星的中心点，表达亿万人民心向伟大的中国共产党，如似众星拱北辰。
        <br><br>
        旗杆套为白色，以与旗面的红色相区别。
        </p>
      </li>
    `
  } else if (answer == '3') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return ;
  }
}

function question2(answer) {
  if (answer == 'B') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答正确！
        <br><br>
        《中华人民共和国国旗法》规定：为确保国旗的圣洁和完整，天安门广场上空的国旗基本上几天更换一面。
        <br>
        每逢重大节日，必须更换新国旗。即使国旗不受损，悬挂的最长时间也不得超过10天。
        </p>
      </li>
    `
  } else if (answer == 'A' || answer == 'C') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答错咯~
        <br><br>
        《中华人民共和国国旗法》规定：为确保国旗的圣洁和完整，天安门广场上空的国旗基本上几天更换一面。
        <br>
        每逢重大节日，必须更换新国旗。即使国旗不受损，悬挂的最长时间也不得超过10天。
        </p>
      </li>
    `
  }
}

function question3(answer) {
  if (answer == '1') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="7.5">
        <h2 class="user7"></h2>
        <p>
        <b>登珠峰之险</b>
        <br><br>
        5月21日时，珠峰附近已出现西南季风，26日西南季风北上至喜马拉雅山脉南麓，引起南坡大量降水。一旦降水开始，登顶之难将乘几何倍数递增。
        <br><br>
        除了天气带来的险境，更可怕的是珠峰北坡的恶劣地形。
        <br><br>
        北坡除了和南坡相似的严寒、缺氧、冰川裂缝、冰崩、雪崩、暴风雪等艰难条件以外，还有两个最艰险的地带——“北坳”和“第二台阶”，这两处平均坡度均在六七十度左右，前者是最容易发生冰崩和雪崩的危险地区，后者则高有30米，顶部还有3米左右的垂直峭壁。
        <br><br>
        所以北坡一直被西方登山界认为是“无法超越的”一条登顶之路。
        </p>
      </li>
    `
  } else if (answer == '2') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="5.5">
        <h2 class="user7"></h2>
        <p>
        <b>登顶成就</b>
        <br><br>
        这是人类历史上第一次从珠峰北坡顺利登顶。
        <br><br>
        这次珠峰登顶从1960年3月25日始，只用了两个月的时间就顺利从西方登山界公认“无法超越的”珠峰北坡成功登顶，并将五星红旗插上了世界之巅。
        <br><br>
        这次壮举是由三位年轻的中国登山队队员（王富洲、贡布、屈银华）完成的，他们集体登顶后在顶峰竖起红色测量觇标，经3天观测，精确计算出珠穆朗玛峰海拔高度为8848.13米。
        </p>
      </li>
    `
  } else if (answer == '3') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        <b>登顶意义</b>
        <br><br>
        毫无疑问，中国登山队在物质条件十分艰苦的条件下成功从北坡登顶珠峰，完成了人类历史上前无古人的壮举，这不仅是个体力量与意志的胜利，更是在当时国际大背景下中国精神力量的成功展示。
        <br><br>
        登珠峰的1960年，中国正处于三年困难时期，在此背景下，登顶珠峰超越了体育而成了国家精神的展示，堪称一颗“精神原子弹”，激励了困境中的中国人民艰苦奋斗，奋勇前行。
        <br><br>
        而在当时的历史背景和物质条件下，登顶队员抱着必死的信念登顶，这种牺牲小我成就大我的精神，至今仍让人感念。
        </p>
      </li>
    `
  } else if (answer == '4') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return ;
  }
}

function question4(answer) {
  if (answer == 'A') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答正确！
        <br><br>
        1960年 中国登山队队员王富洲、屈银华和贡布实现人类第一次从北坡登顶珠峰壮举。
        </p>
      </li>
    `
  } else if (answer == 'B' || answer == 'C') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答错咯~
        <br><br>
        1960年 中国登山队队员王富洲、屈银华和贡布实现人类第一次从北坡登顶珠峰壮举。
        </p>
      </li>
    `
  }
}

function question5(answer) {
  if (answer == 'B') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答正确！
        <br><br>
        自第二次世界大战结束后，中国一直是联合国的创始国和安理会5个常任理事国之一。
        <br><br>
        然而，由于美国的阻挠，新中国在联合国的合法席位被逃到台湾的蒋介石集团所占据。故而这是新中国自成立以来22年，终于进入联合国。
        </p>
      </li>
    `
  } else if (answer == 'A' || answer == 'C') {
    $(".s2 li:hidden[href='wait']:first").remove();
    return `
      <li delay="3.5">
        <h2 class="user7"></h2>
        <p>
        回答错咯~
        <br><br>
        自第二次世界大战结束后，中国一直是联合国的创始国和安理会5个常任理事国之一。
        <br><br>
        然而，由于美国的阻挠，新中国在联合国的合法席位被逃到台湾的蒋介石集团所占据。故而这是新中国自成立以来22年，终于进入联合国。
        </p>
      </li>
    `
  }
}