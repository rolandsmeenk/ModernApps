function ApplicationConfiguration()
{
    this.LoadConfiguration = function (appnumber) {

        Experience.Instance.Reset();
        switch (appnumber) {
            case 1: ConfigureApplication1(); break;
            case 2: ConfigureApplication2(); break;
            case 3: ConfigureApplication3(); break;
            case 4: ConfigureApplication4(); break;
            case 5: ConfigureApplication5(); break;
            case 6: ConfigureApplication6(); break;
            case 7: ConfigureApplication7(); break;
        }
        Experience.Instance.Start();
    }

    function ConfigureApplication1()
    {
        Experience.Instance.AllowVerticalNavigation = false;
        Experience.Instance.AllowHorizontalNavigation = true;
        

        Experience.Instance.Attach(new PageX("pg1", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', '../Assets/Billboards/0001.jpg', 'Metro?!', 'normal 96px Segoe UI', 50, 450, "Yellow", "Black")]));
        Experience.Instance.Attach(new PageX("pg2", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(3);', '../Assets/Billboards/0002.jpg', 'Follow the rainbow', 'normal 96px Segoe UI', 120, 100, "Cyan", "Black")]));
        Experience.Instance.Attach(new PageX("pg3", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(4);', '../Assets/Billboards/0003.jpg', 'Classic Metro', 'normal 96px Segoe UI', 350, 450, "White", "Black")]));
        Experience.Instance.Attach(new PageX("pg4", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(5);', '../Assets/Billboards/0004.jpg', 'Metro on time!', 'normal 96px Segoe UI', 0, 450, "Orange", "Black")]));
        Experience.Instance.Attach(new PageX("pg5", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(6);', '../Assets/Billboards/0005.jpg', 'Metro for dinner!', 'normal 96px Segoe UI', 250, 120, "Yellow", "Black")]));
        Experience.Instance.Attach(new PageX("pg5", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(7);', '../Assets/Billboards/0006.jpg', '♥ Metro ♥', 'normal 96px Segoe UI', 230, 300, "Red", "Yellow")]));
        Experience.Instance.Attach(new PageX("pg5", 7, 5, [[0, 27]], [new ElasticButton(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(8);', '../Assets/Billboards/0007.jpg', 'Party Time!', 'normal 96px Segoe UI', 0, 100, "Purple", "White")]));

    }
    function ConfigureApplication2() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg1", 7, 15,
        [
            [0, 27]
            , [28,33]
            , [34]
            , [35,45]
        ],
        [
            new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), '', '../Assets/Billboards/0001.jpg', 'Metro?!', 'normal 96px Segoe UI', 50, 450, "Yellow", "Black")
            , new LabelTitle(1, 10, 1.0, 'Metro is the reinventing of Microsoft', '& the reinvigoration of their classic product lines!', 'Segoe UI', 'White', 'Black', 10)
            , new LabelDate(2, 10, 1.0, '27', 'May', '2012', 'Segoe UI', 'White', 10)
            , new LabelParagraph(3, 10, 1.0, 'Segoe UI', 22, 'Black', 'Transparent', 5, 3,
                [
                    'Prime Minister Julia Gillard says she is satisfied with words of support from Joel Fitzgibbon on Twitter despite reports the government whip has switched to Kevin Rudds camp.'
                    , 'Ms Gillard was commenting on Fairfax reports that Mr Fitzgibbon was openly canvassing for votes to return Kevin Rudd as prime minister.'
                    , 'Ms Gillard refused to comment other than saying Mr Fitzgibbo’s words speak for themselves. "I’ll be happily leading Labor to the next election", she told reporters in Canberra.'
                    , 'The Prime Minister denied the government was divided and dysfunctional.'
                    , '"We lead a government that is getting on with the job, most importantly keeping the economy strong," she said.'
                    , 'Asked whether Mr Fitzgibbon’s tweet was enough to settle the issue, Ms Gillard said: "I think his words are clear."'
                    , '"It’s not the vehicle as to how they’ve been disseminated but what they say."s'
                    , 'She would not be drawn on questions as to whether she had spoken to Mr Fitzgibbon since the reports emerged of his pitch for a leadership change.'
                    , 'The reports had earlier prompted government frontbencher Greg Combet to say Mr Fitzgibbon needs to answer questions about his position.'
                    , 'Further comment is being sought from Mr Fitzgibbon.'
                    , 'Both Fairfax and News Limited papers say Mr Fitzgibbon is openly canvassing for votes to return Mr Rudd to the party leadership.'
                    , 'Mr Combet indicated he was surprised by the reports.'
                ]
            )
            
        ]));
 
        
        

    }
    function ConfigureApplication3() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg2", 7, 5, [[0, 27]], [new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(3);', '../Assets/Billboards/0002.jpg', 'Follow the rainbow', 'normal 96px Segoe UI', 120, 100, "Cyan", "Black")]));


    }
    function ConfigureApplication4() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg3", 7, 5, [[0, 27]], [new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(4);', '../Assets/Billboards/0003.jpg', 'Classic Metro', 'normal 96px Segoe UI', 350, 450, "White", "Black")]));


    }
    function ConfigureApplication5() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg4", 7, 5, [[0, 27]], [new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(5);', '../Assets/Billboards/0004.jpg', 'Metro on time!', 'normal 96px Segoe UI', 0, 450, "Orange", "Black")]));


    }
    function ConfigureApplication6() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg5", 7, 5, [[0, 27]], [new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(6);', '../Assets/Billboards/0005.jpg', 'Metro for dinner!', 'normal 96px Segoe UI', 250, 120, "Yellow", "Black")]));


    }
    function ConfigureApplication7() {
        Experience.Instance.AllowVerticalNavigation = true;
        Experience.Instance.AllowHorizontalNavigation = false;

        Experience.Instance.Attach(new PageX("pg5", 7, 5, [[0, 34]], [new Banner(0, "Black", "Black", new Storyboard('quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(7);', '../Assets/Billboards/0006.jpg', '♥ Metro ♥', 'normal 96px Segoe UI', 230, 300, "Red", "Yellow")]));


    }
}

