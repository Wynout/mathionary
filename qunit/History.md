  


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>qunit/History.md at v1.11.0 · jquery/qunit</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png" />
    <link rel="logo" type="image/svg" href="http://github-media-downloads.s3.amazonaws.com/github-logo.svg" />
    <link rel="xhr-socket" href="/_sockets" />


    <meta name="msapplication-TileImage" content="/windows-tile.png" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="selected-link" value="repo_source" data-pjax-transient />
    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="github" name="octolytics-app-id" /><meta content="2788745" name="octolytics-actor-id" /><meta content="a46911742e025de59a8b9cdc5eae0be5ed5b3cfef38324c4825747f2c7a79db1" name="octolytics-actor-hash" />

    
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="K49cJeuxvhMOpIT/VH/pOqaUag70/jgfcw8ofwLgLXQ=" name="csrf-token" />

    <link href="https://a248.e.akamai.net/assets.github.com/assets/github-d63f89e307e2e357d3b7160b3cd4020463f9bbc1.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://a248.e.akamai.net/assets.github.com/assets/github2-883c2d036f95a0fb486a5d977a84cb0b91a58353.css" media="all" rel="stylesheet" type="text/css" />
    


      <script src="https://a248.e.akamai.net/assets.github.com/assets/frameworks-92d138f450f2960501e28397a2f63b0f100590f0.js" type="text/javascript"></script>
      <script src="https://a248.e.akamai.net/assets.github.com/assets/github-9514cee43c62b106e5ca1f5cf2107a0c1fad9381.js" type="text/javascript"></script>
      
      <meta http-equiv="x-pjax-version" content="69eecf449c3b66a1c0a67e6f1032684b">

        <link data-pjax-transient rel='permalink' href='/jquery/qunit/blob/6ca3721222109997540bd6d9ccd396902e0ad2f9/History.md'>
    <meta property="og:title" content="qunit"/>
    <meta property="og:type" content="githubog:gitrepository"/>
    <meta property="og:url" content="https://github.com/jquery/qunit"/>
    <meta property="og:image" content="https://secure.gravatar.com/avatar/6906f317a4733f4379b06c32229ef02f?s=420&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"/>
    <meta property="og:site_name" content="GitHub"/>
    <meta property="og:description" content="qunit - An easy-to-use JavaScript Unit Testing framework."/>
    <meta property="twitter:card" content="summary"/>
    <meta property="twitter:site" content="@GitHub">
    <meta property="twitter:title" content="jquery/qunit"/>

    <meta name="description" content="qunit - An easy-to-use JavaScript Unit Testing framework." />


    <meta content="70142" name="octolytics-dimension-user_id" /><meta content="259691" name="octolytics-dimension-repository_id" />
  <link href="https://github.com/jquery/qunit/commits/v1.11.0.atom" rel="alternate" title="Recent Commits to qunit:v1.11.0" type="application/atom+xml" />

  </head>


  <body class="logged_in page-blob linux vis-public env-production  ">
    <div id="wrapper">

      

      
      
      

      <div class="header header-logged-in true">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/">
  <span class="mega-octicon octicon-mark-github"></span>
</a>

    <div class="divider-vertical"></div>

      <a href="/notifications" class="notification-indicator tooltipped downwards" title="You have no unread notifications">
    <span class="mail-status all-read"></span>
  </a>
  <div class="divider-vertical"></div>


      <div class="command-bar js-command-bar  in-repository">
          <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">
  <a href="/search/advanced" class="advanced-search-icon tooltipped downwards command-bar-search" id="advanced_search" title="Advanced search"><span class="octicon octicon-gear "></span></a>

  <input type="text" data-hotkey="/ s" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" autocapitalize="off"
    data-username="Wynout"
      data-repo="jquery/qunit"
      data-branch="v1.11.0"
      data-sha="0a36c2d7bd264626bb553a1f913da2d7370325c2"
  >

    <input type="hidden" name="nwo" value="jquery/qunit" />

    <div class="select-menu js-menu-container js-select-menu search-context-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">This repository</span>
      </span>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">
        <div class="select-menu-modal">

          <div class="select-menu-item js-navigation-item selected">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" class="js-search-this-repository" name="search_target" value="repository" checked="checked" />
            <div class="select-menu-item-text js-select-button-text">This repository</div>
          </div> <!-- /.select-menu-item -->

          <div class="select-menu-item js-navigation-item">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" name="search_target" value="global" />
            <div class="select-menu-item-text js-select-button-text">All repositories</div>
          </div> <!-- /.select-menu-item -->

        </div>
      </div>
    </div>

  <span class="octicon help tooltipped downwards" title="Show command bar help">
    <span class="octicon octicon-question"></span>
  </span>


  <input type="hidden" name="ref" value="cmdform">

  <div class="divider-vertical"></div>

</form>
        <ul class="top-nav">
            <li class="explore"><a href="https://github.com/explore">Explore</a></li>
            <li><a href="https://gist.github.com">Gist</a></li>
            <li><a href="/blog">Blog</a></li>
          <li><a href="http://help.github.com">Help</a></li>
        </ul>
      </div>

    

  

    <ul id="user-links">
      <li>
        <a href="https://github.com/Wynout" class="name">
          <img height="20" src="https://secure.gravatar.com/avatar/37377e470bac29a17809328493f36e33?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /> Wynout
        </a>
      </li>

        <li>
          <a href="/new" id="new_repo" class="tooltipped downwards" title="Create a new repo">
            <span class="octicon octicon-repo-create"></span>
          </a>
        </li>

        <li>
          <a href="/settings/profile" id="account_settings"
            class="tooltipped downwards"
            title="Account settings ">
            <span class="octicon octicon-tools"></span>
          </a>
        </li>
        <li>
          <a class="tooltipped downwards" href="/logout" data-method="post" id="logout" title="Sign out">
            <span class="octicon octicon-log-out"></span>
          </a>
        </li>

    </ul>


<div class="js-new-dropdown-contents hidden">
  <ul class="dropdown-menu">
    <li>
      <a href="/new"><span class="octicon octicon-repo-create"></span> New repository</a>
    </li>
    <li>
        <a href="https://github.com/jquery/qunit/issues/new"><span class="octicon octicon-issue-opened"></span> New issue</a>
    </li>
    <li>
    </li>
    <li>
      <a href="/organizations/new"><span class="octicon octicon-list-unordered"></span> New organization</a>
    </li>
  </ul>
</div>


    
  </div>
</div>

      

      

      


            <div class="site hfeed" itemscope itemtype="http://schema.org/WebPage">
      <div class="hentry">
        
        <div class="pagehead repohead instapaper_ignore readability-menu ">
          <div class="container">
            <div class="title-actions-bar">
              

<ul class="pagehead-actions">


    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="K49cJeuxvhMOpIT/VH/pOqaUag70/jgfcw8ofwLgLXQ=" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="259691" />

    <div class="select-menu js-menu-container js-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">
          <span class="octicon octicon-eye-watch"></span>
          Watch
        </span>
      </span>

      <div class="select-menu-modal-holder js-menu-content">
        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Notification status</span>
            <span class="octicon octicon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container">

            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">You only receive notifications for discussions in which you participate or are @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-watch"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">You receive notifications for all discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-unwatch"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">You do not receive any notifications for discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

    <li class="js-toggler-container js-social-container starring-container ">
      <a href="/jquery/qunit/unstar" class="minibutton js-toggler-target star-button starred upwards" title="Unstar this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="octicon octicon-star-delete"></span>
        <span class="text">Unstar</span>
      </a>
      <a href="/jquery/qunit/star" class="minibutton js-toggler-target star-button unstarred upwards" title="Star this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="octicon octicon-star"></span>
        <span class="text">Star</span>
      </a>
      <a class="social-count js-social-count" href="/jquery/qunit/stargazers">2,491</a>
    </li>

        <li>
          <a href="/jquery/qunit/fork" class="minibutton js-toggler-target fork-button lighter upwards" title="Fork this repo" rel="nofollow" data-method="post">
            <span class="octicon octicon-git-branch-create"></span>
            <span class="text">Fork</span>
          </a>
          <a href="/jquery/qunit/network" class="social-count">438</a>
        </li>


</ul>

              <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
                <span class="repo-label"><span>public</span></span>
                <span class="mega-octicon octicon-repo"></span>
                <span class="author vcard">
                  <a href="/jquery" class="url fn" itemprop="url" rel="author">
                  <span itemprop="title">jquery</span>
                  </a></span> /
                <strong><a href="/jquery/qunit" class="js-current-repository">qunit</a></strong>
              </h1>
            </div>

            
  <ul class="tabs">
    <li class="pulse-nav"><a href="/jquery/qunit/pulse" class="js-selected-navigation-item " data-selected-links="pulse /jquery/qunit/pulse" rel="nofollow"><span class="octicon octicon-pulse"></span></a></li>
    <li><a href="/jquery/qunit/tree/v1.11.0" class="js-selected-navigation-item selected" data-selected-links="repo_source repo_downloads repo_commits repo_tags repo_branches /jquery/qunit/tree/v1.11.0">Code</a></li>
    <li><a href="/jquery/qunit/network" class="js-selected-navigation-item " data-selected-links="repo_network /jquery/qunit/network">Network</a></li>
    <li><a href="/jquery/qunit/pulls" class="js-selected-navigation-item " data-selected-links="repo_pulls /jquery/qunit/pulls">Pull Requests <span class='counter'>5</span></a></li>

      <li><a href="/jquery/qunit/issues" class="js-selected-navigation-item " data-selected-links="repo_issues /jquery/qunit/issues">Issues <span class='counter'>43</span></a></li>



    <li><a href="/jquery/qunit/graphs" class="js-selected-navigation-item " data-selected-links="repo_graphs repo_contributors /jquery/qunit/graphs">Graphs</a></li>


  </ul>
  
<div class="tabnav">

  <span class="tabnav-right">
    <ul class="tabnav-tabs">
          <li><a href="/jquery/qunit/tags" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_tags /jquery/qunit/tags">Tags <span class="counter ">13</span></a></li>
    </ul>
  </span>

  <div class="tabnav-widget scope">


    <div class="select-menu js-menu-container js-select-menu js-branch-menu">
      <a class="minibutton select-menu-button js-menu-target" data-hotkey="w" data-ref="v1.11.0">
        <span class="octicon octicon-tag"></span>
        <i>tag:</i>
        <span class="js-select-button">v1.11.0</span>
      </a>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">

        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Switch branches/tags</span>
            <span class="octicon octicon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-filters">
            <div class="select-menu-text-filter">
              <input type="text" id="commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
            </div>
            <div class="select-menu-tabs">
              <ul>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
                </li>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
                </li>
              </ul>
            </div><!-- /.select-menu-tabs -->
          </div><!-- /.select-menu-filters -->

          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="branches">

            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/composite/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="composite" rel="nofollow" title="composite">composite</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/gh-pages/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="gh-pages" rel="nofollow" title="gh-pages">gh-pages</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/master/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="master" rel="nofollow" title="master">master</a>
                </div> <!-- /.select-menu-item -->
            </div>

              <div class="select-menu-no-results">Nothing to show</div>
          </div> <!-- /.select-menu-list -->


          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="tags">
            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

                <div class="select-menu-item js-navigation-item selected">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.11.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.11.0" rel="nofollow" title="v1.11.0">v1.11.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.10.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.10.0" rel="nofollow" title="v1.10.0">v1.10.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.9.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.9.0" rel="nofollow" title="v1.9.0">v1.9.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.8.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.8.0" rel="nofollow" title="v1.8.0">v1.8.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.7.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.7.0" rel="nofollow" title="v1.7.0">v1.7.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.6.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.6.0" rel="nofollow" title="v1.6.0">v1.6.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.5.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.5.0" rel="nofollow" title="v1.5.0">v1.5.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.4.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.4.0" rel="nofollow" title="v1.4.0">v1.4.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.3.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.3.0" rel="nofollow" title="v1.3.0">v1.3.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.2.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.2.0" rel="nofollow" title="v1.2.0">v1.2.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.1.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.1.0" rel="nofollow" title="v1.1.0">v1.1.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/v1.0.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.0.0" rel="nofollow" title="v1.0.0">v1.0.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/jquery/qunit/blob/1.1.0/History.md" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="1.1.0" rel="nofollow" title="1.1.0">1.1.0</a>
                </div> <!-- /.select-menu-item -->
            </div>

            <div class="select-menu-no-results">Nothing to show</div>

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

  </div> <!-- /.scope -->

  <ul class="tabnav-tabs">
    <li><a href="/jquery/qunit/tree/v1.11.0" class="selected js-selected-navigation-item tabnav-tab" data-selected-links="repo_source /jquery/qunit/tree/v1.11.0">Files</a></li>
    <li><a href="/jquery/qunit/commits/v1.11.0" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_commits /jquery/qunit/commits/v1.11.0">Commits</a></li>
    <li><a href="/jquery/qunit/branches" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_branches /jquery/qunit/branches" rel="nofollow">Branches <span class="counter ">3</span></a></li>
  </ul>

</div>

  
  
  


            
          </div>
        </div><!-- /.repohead -->

        <div id="js-repo-pjax-container" class="container context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:d7ad6a737fe43e22e78ce7fe28d802b2 -->
<!-- blob contrib frag key: views10/v8/blob_contributors:v21:d7ad6a737fe43e22e78ce7fe28d802b2 -->


<div id="slider">
    <div class="frame-meta">

      <p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

        <div class="breadcrumb">
          <span class='bold'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/jquery/qunit/tree/v1.11.0" class="js-slide-to" data-branch="v1.11.0" data-direction="back" itemscope="url"><span itemprop="title">qunit</span></a></span></span><span class="separator"> / </span><strong class="final-path">History.md</strong> <span class="js-zeroclipboard zeroclipboard-button" data-clipboard-text="History.md" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
        </div>

      <a href="/jquery/qunit/find/v1.11.0" class="js-slide-to" data-hotkey="t" style="display:none">Show File Finder</a>


        
  <div class="commit file-history-tease">
    <img class="main-avatar" height="24" src="https://secure.gravatar.com/avatar/a9d4d2558b560b0ef168ced0f6c5198c?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
    <span class="author"><a href="/jzaefferer" rel="author">jzaefferer</a></span>
    <time class="js-relative-date" datetime="2013-01-20T14:28:13-08:00" title="2013-01-20 14:28:13">January 20, 2013</time>
    <div class="commit-title">
        <a href="/jquery/qunit/commit/6ca3721222109997540bd6d9ccd396902e0ad2f9" class="message">Release 1.11.0</a>
    </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>1</strong> contributor</a></p>
      
    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2>Users on GitHub who have contributed to this file</h2>
      <ul class="facebox-user-list">
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/a9d4d2558b560b0ef168ced0f6c5198c?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/jzaefferer">jzaefferer</a>
        </li>
      </ul>
    </div>
  </div>


    </div><!-- ./.frame-meta -->

    <div class="frames">
      <div class="frame" data-permalink-url="/jquery/qunit/blob/6ca3721222109997540bd6d9ccd396902e0ad2f9/History.md" data-title="qunit/History.md at v1.11.0 · jquery/qunit · GitHub" data-type="blob">

        <div id="files" class="bubble">
          <div class="file">
            <div class="meta">
              <div class="info">
                <span class="icon"><b class="octicon octicon-file-text"></b></span>
                <span class="mode" title="File Mode">file</span>
                  <span>497 lines (475 sloc)</span>
                <span>38.432 kb</span>
              </div>
              <div class="actions">
                <div class="button-group">
                      <a class="minibutton js-entice" href=""
                         data-entice="You must be signed in and on a branch to make or propose changes">Edit</a>
                  <a href="/jquery/qunit/raw/v1.11.0/History.md" class="button minibutton " id="raw-url">Raw</a>
                    <a href="/jquery/qunit/blame/v1.11.0/History.md" class="button minibutton ">Blame</a>
                  <a href="/jquery/qunit/commits/v1.11.0/History.md" class="button minibutton " rel="nofollow">History</a>
                </div><!-- /.button-group -->
              </div><!-- /.actions -->

            </div>
              
  <div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1>
<a name="1110--2013-01-20" class="anchor" href="#1110--2013-01-20"><span class="mini-icon mini-icon-link"></span></a>1.11.0 / 2013-01-20</h1>

<ul>
<li>Diff: Fix exception on property "constructor". Fixes #394.</li>
<li>Composite Add-on: Test suites can be named by including an obj with name &amp; path props within array param for .testSuites()</li>
<li>Fix URL generator to take protocol and host into account to fix usage with file protocol in IE7/8</li>
<li>Fix issue with Error.prototype.toString in IE 7</li>
<li>Refactor jsDump for "node". Fixes #381.</li>
<li>Show contents of text nodes in jsDump.node. Fixes #380.</li>
<li>Escape text. Fixes #379.</li>
<li>Rewrote most of the JUnitLogger addon as it was in bad shape: unused variables, duplicate effort that QUnit handles internally (e.g. tallying number of total assertions, failed assertions, etc.), sub-optimal XmlWriter implementation, etc.</li>
<li>Phantomjs: Include source in assertion details</li>
<li>Phantomjs: Removed the polling mechanism in favor of PhantomJS 1.6+'s <code>WebPage#onCallback</code>
</li>
<li>Delay start() until init() happened. Fixes #358. Closes #373.</li>
<li>urlConfig: Fix checkbox event for oldIE. Fixes #369. Closes #370.</li>
<li>Issue #365: Fix module picker for oldIE. Closes #366.</li>
<li>Fixes #344 - Capture and show test duration.</li>
<li>Rename tests to assertions in summary. Fixes #336 - Summary counts assertions but mentions 'tests'.</li>
<li>Assert: Implement propEqual and notPropEqual. Fixes #317.</li>
<li>Canvas addon: Use 0.6 as alpha value to avoid inconsistencies between browsers. Fixes #342</li>
<li>Remove global variable "assert". Fixes #341.</li>
<li>Add a test for loading tests asynchronously</li>
<li>Improve start()-called-too-often fix, initialize semaphore at 1, fixes autostart=false case. Also provide stack for the offending start() call</li>
<li>There's type-free objects in Firefox, extend objectType() to allow null match. Fixes #315</li>
<li>Push a failing assertion when calling start() while already running. Resets anyway to keep other tests going. Fixes #314</li>
<li>Adds Ninja Theme</li>
<li>Extend jsdump to output Error objects as such, including the message property. Extend throws to provide 'expected' value when possible. Fixes #307</li>
<li>Use classes to collapse assertion groups. Fixes #269</li>
<li>Readme for junitlogger addon</li>
<li>Better readme for composite addon</li>
<li>Make <code>throws</code> ES3 compatible</li>
<li>Composite: Adds test whether iframe contains content. Fixes #318 - Composite: Raises "global failure" in Opera</li>
<li>Apply the same exception handling for test and teardown try/catch as for setup</li>
</ul><h1>
<a name="1100--2012-08-30" class="anchor" href="#1100--2012-08-30"><span class="mini-icon mini-icon-link"></span></a>1.10.0 / 2012-08-30</h1>

<ul>
<li>Simplify licensing: Only MIT, no more MIT/GPL dual licensing.</li>
<li>Scroll the window back to top after tests finished running. Fixes #304</li>
<li>Simplify phantomjs runner to use module property in testDone callback</li>
<li>Adds module and test name to the information that is returned in the callback provided to QUnit.log(Function). Fixes #296</li>
<li>Make QUnit.expect() (without arguments) a getter. Fixes #226</li>
<li>Compare the ES6 sticky (y) property for RegExp. Can't add to tests yet. Fixes #284 - deepEqual for RegExp should compare</li>
<li>onerror: force display of global errors despite URL parameters. Fixes #288 - Global failures can be filtered out by test-limiting URL parameters</li>
<li>Remove conditional codepath based on jQuery presence from reset().</li>
<li>Add module filter to UI</li>
<li>Keep a local reference to Date. Fixes #283.</li>
<li>Update copyright to jQuery Foundation.</li>
</ul><h1>
<a name="190--2012-07-11" class="anchor" href="#190--2012-07-11"><span class="mini-icon mini-icon-link"></span></a>1.9.0 / 2012-07-11</h1>

<ul>
<li>added jsdoc for QUnit.assert functions</li>
<li>Styling: radius to 5px and small pass/error border, remove inner shadow</li>
<li>Move checkboxes into toolbar and give them labels and descriptions (as tooltip). Fixes #274 - Improve urlFilter API and UI</li>
<li>Where we recieve no exception in throws() use a relevant message.</li>
<li>Also make module filter case-insensitive. Follow-up to #252</li>
<li>Banner: Link should ignore "testNumber" and "module". Fixes #270</li>
<li>Rename assert.raises to assert.throws. Fixes #267</li>
<li>Change package.json name property to 'qunitjs' to avoid conflicht with node-qunit; will publish next release to npm</li>
</ul><h1>
<a name="180--2012-06-14" class="anchor" href="#180--2012-06-14"><span class="mini-icon mini-icon-link"></span></a>1.8.0 / 2012-06-14</h1>

<ul>
<li>Improve window.onerror handling</li>
<li>(issue #260) config.current should be reset at the right time.</li>
<li>Filter: Implement 'module' url parameter. Fixes #252</li>
<li>raises: ignore global exceptions stemming from test. Fixes #257 - Globally-executed errors sneak past raises in IE</li>
</ul><h1>
<a name="170--2012-06-07" class="anchor" href="#170--2012-06-07"><span class="mini-icon mini-icon-link"></span></a>1.7.0 / 2012-06-07</h1>

<ul>
<li>Add config.requireExpects. Fixes #207 - Add option to require all tests to call expect().</li>
<li>Improve extractStacktrace() implementation. Fixes #254 - Include all relevant stack lines</li>
<li>Make filters case-insensitive. Partial fix for #252</li>
<li>is() expects lowercase types. Fixes #250 - Expected Date value is not displayed properly</li>
<li>Fix phantomjs addon header and add readme. Fixes #239</li>
<li>Add some hints to composite addon readme. Fixes #251</li>
<li>Track tests by the order in which they were run and create rerun links based on that number. Fixes #241 - Make Rerun link run only a single test.</li>
<li>Use QUnit.push for raises implementation. Fixes #243</li>
<li>CLI runner for phantomjs</li>
<li>Fix jshint validation until they deal with /** */ comments properly</li>
<li>Update validTest() : Simplify logic, clarify vars and add comments</li>
<li>Refactor assertion helpers into QUnit.assert (backwards compatible)</li>
<li>Add Rerun link to placeholders. Fixes #240</li>
</ul><h1>
<a name="160--2012-05-04" class="anchor" href="#160--2012-05-04"><span class="mini-icon mini-icon-link"></span></a>1.6.0 / 2012-05-04</h1>

<ul>
<li>Save stack for each test, use that for failed expect() results, points at the line where test() was called. Fixes #209</li>
<li>Prefix test-output id and ignore that in noglobals check. Fixes #212</li>
<li>Only check for an exports object to detect a CommonJS enviroment. Fixes #237 - Incompatibility with require.js</li>
<li>Add testswarm integration as grunt task</li>
<li>Added padding on URL config checkboxes.</li>
<li>Cleanup composite addon: Use callback registration instead of overwriting them. Set the correct src on rerun link (and dblclick). Remove the composite test itself, as that was a crazy hack not worth maintaining</li>
<li>Cleanup reset() test and usage - run testDone callback first, to allow listeneres ignoring reset assertions</li>
<li>Double clicking on composite test rows opens individual test page</li>
<li>test-message for all message-bearing API reporting details</li>
</ul><h1>
<a name="150--2012-04-04" class="anchor" href="#150--2012-04-04"><span class="mini-icon mini-icon-link"></span></a>1.5.0 / 2012-04-04</h1>

<ul>
<li>Modify "Running..." to display test name. Fixes #220</li>
<li>Fixed clearing of sessionStorage in Firefox 3.6.</li>
<li>Fixes #217 by calling "block" with config.current.testEnvironment</li>
<li>Add stats results to data. QUnit.jUnitReport function take one argument {   xml:'&lt;?xml ...',   results:{failed:0, passed:0, total:0, time:0} }</li>
<li>Add link to MDN about stack property</li>
</ul><h1>
<a name="140--2012-03-10" class="anchor" href="#140--2012-03-10"><span class="mini-icon mini-icon-link"></span></a>1.4.0 / 2012-03-10</h1>

<ul>
<li>Prefix test-related session-storage items to make removal more specific. Fixes #213 - Keep hide-passed state when clearing session storage</li>
<li>Update grunt.js with seperate configs for qunit.js and grunt.js, also add tests but disable for now, not passing yet. Add grunt to devDependencies</li>
<li>typo</li>
<li>Cleanup grunt.js, no need for the banner</li>
<li>Fix lint errors and some formatting issues. Use QUnit.pushFailure for noglobals and global error handler.</li>
<li>Fix a missing expect in logs test</li>
<li>Add grunt.js configuration and include some usage instructions in the readme</li>
<li>Update package.json</li>
<li>Partially revert af27eae841c3e1c01c46de72d676f1047e1ee375 - can't move reset around, so also don't wrap in try-catch, as the result of that is effectively swallowed. Can't output the result as the outputting is already done.</li>
<li>Add QUnit.pushFailure to log error conditions like exceptions. Accepts stacktrace as second argument, allowing extraction with catched exceptions (useful even in Safari). Remove old fail() function that would just log to console, not useful anymore as regular test output is much more useful by now. Move up QUnit.reset() call to just make that another failed assertion. Used to not make a test fail. Fixes #210</li>
<li>Update equals and same deprecations to use QUnit.push to provide correct source lines. Fixes #211</li>
<li>Add a test file for narwhal integration. Has to use print instead of console.log. Fails when an assertion fails, something about setInterval...</li>
<li>Apply notrycatch option to setup and teardown as well. Fixes #203. Reorder noglobals check to allow teardown to remove globals that were introduced intentionally. Fixes #204</li>
<li>Extend exports object with QUnit properties at the end of the file to export everything.</li>
<li>Output source line for ok() assertions. Fixes #202</li>
<li>Make test fail if no assertions run. Fixes #178</li>
<li>Sort object output alphabetically in order to improve diffs of objects where properties were set in a different order. Fixes #206</li>
<li>Revert "Change fixture reset behavior", changing #194 and #195 to wontfix.</li>
</ul><h1>
<a name="130--2012-02-26" class="anchor" href="#130--2012-02-26"><span class="mini-icon mini-icon-link"></span></a>1.3.0 / 2012-02-26</h1>

<ul>
<li>Cleanup test markup</li>
<li>Fix the jQuery branch of fixture reset. Would break when no fixture exists.</li>
<li>Added initial version of a junitlogger addon.</li>
<li>Escape document.title before inserting into markup. Extends fix for #127</li>
<li>Catch assertions running outside of test() context, make sure source is provided even for ok(). Fixes #98</li>
<li>Improve global object access, based on comments for 1a9120651d5464773256d8a1f2cf2eabe38ea5b3</li>
<li>Clear all sessionStorage entries once all tests passed. Helps getting rid of items from renamed tests. Fixes #101</li>
<li>Set fixed dimensions for #qunit-fixture. Fixes #114</li>
<li>Extend nodejs test runner to check for stacktrace output, twice</li>
<li>Extend nodejs test runner to check for stacktrace output</li>
<li>Generate more base markup, but allow the user to exclude that completelty or choose their own. Fixes #127</li>
<li>Add a simple test file to check basic nodejs integration works</li>
<li>Check for global object to find setTimeout in node</li>
<li>Fix CommonJS export by assigning QUnit to module.exports.</li>
<li>Remove the testEnviromentArg to test(). Most obscure, never used anywhere. test() is still heavily overloaded with argument shifting, this makes it a little more sane. Fixes #172</li>
<li>Serialize expected and actual values only when test fails. Speeds up output of valid tests, especially for lots of large objects. Fixes #183</li>
<li>Fix sourceFromsTacktrace to get the right line in Firefox. Shift the 'error' line away in Chrome to get a match.</li>
<li>Fix references to test/deepEqual.js</li>
<li>In autorun mode, moduleDone is called without matching moduleStart. Fix issue #184</li>
<li>Fixture test: allow anything falsy in test as getAttribute in oldIE will return empty string instead of null. We don't really care.</li>
<li>Keep label and checkbox together ( <a href="http://i.imgur.com/5Wk3A.png">http://i.imgur.com/5Wk3A.png</a> )</li>
<li>Add readme for themes</li>
<li>Fix bad global in reset()</li>
<li>Some cleanup in theme addons</li>
<li>Update headers</li>
<li>Update nv.html, add gabe theme based on <a href="https://github.com/jquery/qunit/pull/188">https://github.com/jquery/qunit/pull/188</a>
</li>
<li>Experiemental custom theme based on <a href="https://github.com/jquery/qunit/pull/62">https://github.com/jquery/qunit/pull/62</a> by NV</li>
<li>Replace deprecated same and equals aliases with placeholders that just throw errors, providing a hint at what to use instead. Rename test file to match that.</li>
<li>Can't rely on outerHTML for Firefox &lt; 11. Use cloneNode instead.</li>
<li>Merge remote branch 'conzett/master'</li>
<li>Cleanup whitespace</li>
<li>Update sessionStorage support test to latest version from Modernizr, trying to setItem to avoid QUOTA_EXCEEDED_EXCEPTION</li>
<li>Change fixture reset behavior</li>
<li>Merge pull request #181 from simonz/development</li>
<li>Escaping test names</li>
<li>Show exception stack when test failed</li>
</ul><h1>
<a name="120--2011-11-24" class="anchor" href="#120--2011-11-24"><span class="mini-icon mini-icon-link"></span></a>1.2.0 / 2011-11-24</h1>

<ul>
<li>remove uses of equals(), as it's deprecated in favor of equal()</li>
<li>Code review of "Allow objects with no prototype to be tested against object literals."</li>
<li>Allow objects with no prototype to tested against object literals.</li>
<li>Fix IE8 "Member not found" error</li>
<li>Using node-qunit port, the start/stop function are not exposed so we need to prefix any call to them with 'QUnit'. Aka: start() -&gt; QUnit.start()</li>
<li>Remove the 'let teardown clean up globals test' - IE&lt;9 doesn't support (==buggy) deleting window properties, and that's not worth the trouble, as everything else passes just fine. Fixes #155</li>
<li>Fix globals in test.js, part 2</li>
<li>Fix globals in test.js. ?tell wwalser to use ?noglobals everyonce in a while</li>
<li>Extend readme regarding release process</li>
</ul><h1>
<a name="110--2011-10-11" class="anchor" href="#110--2011-10-11"><span class="mini-icon mini-icon-link"></span></a>1.1.0 / 2011-10-11</h1>

<ul>
<li>Fixes #134 - Add a window.onerror handler. Makes uncaught errors actually fail the testsuite, instead of going by unnoticed.</li>
<li>Whitespace cleanup</li>
<li>Merge remote branch 'trevorparscal/master'</li>
<li>Fixed IE compatibility issues with using toString on NodeList objects, which in some browsers results in [object Object] rather than [object NodeList]. Now using duck typing for NodeList objects based on the presence of length, length being a number, presence of item method (which will be typeof string in IE and function in others, so we just check that it's not undefined) and that item(0) returns the same value as [0], unless it's empty, in which case item(0) will return 0, while [0] would return undefined. Tested in IE6, IE8, Firefox 6, Safari 5 and Chrome 16.</li>
<li>Update readme with basic notes on releases</li>
<li>More whitespace/parens cleanup</li>
<li>Check if setTimeout is available before trying to delay running the next task. Fixes #160</li>
<li>Whitespace/formatting fix, remove unnecessary parens</li>
<li>Use alias for Object.prototype.toString</li>
<li>Merge remote branch 'trevorparscal/master'</li>
<li>Merge remote branch 'wwalser/recursionBug'</li>
<li>Default 'expected' to null in asyncTest(), same as in test() itself.</li>
<li>Whitespace cleanup</li>
<li>Merge remote branch 'mmchaney/master'</li>
<li>Merge remote branch 'Krinkle/master'</li>
<li>Using === instead of ==</li>
<li>Added more strict array type detection for dump output, and allowed NodeList objects to be output as arrays</li>
<li>Fixes a bug where after an async test, assertions could move between test cases because of internal state (config.current) being incorrectly set</li>
<li>Simplified check for assertion count and adjusted whitespace</li>
<li>Redo of fixing issue #156 (Support Object.prototype extending environment). * QUnit.diff: Throws exception without this if Object.prototype is set (Property 'length' of undefined. Since Object.prototype.foo doesn't have a property 'rows') * QUnit.url: Without this fix, if Object.prototype.foo is set, the url will be set to ?foo=...&amp;the=rest. * saveGlobals: Without this fix, whenever a member is added to Object.prototype, saveGlobals will think it was a global variable in this loop. --- This time using the call method instead of obj.hasOwnProperty(key), which may fail if the object has that as it's own property (touché!).</li>
<li>Handle expect(0) as expected, i.e. expect(0); ok(true, foo); will cause a test to fail</li>
</ul><h1>
<a name="100--2011-10-06" class="anchor" href="#100--2011-10-06"><span class="mini-icon mini-icon-link"></span></a>1.0.0 / 2011-10-06</h1>

<ul>
<li>Make QUnit work with TestSwarm</li>
<li>Run other addons tests as composite addon demo. Need to move that to /test folder once this setup actually works</li>
<li>Add-on: New assertion-type: step()</li>
<li>added parameter to start and stop allowing a user to increment/decrement the semaphore more than once per call</li>
<li>Update readmes with .md extension for GitHub to render them as markdown</li>
<li>Update close-enough addon to include readme and match (new) naming convetions</li>
<li>Merge remote branch 'righi/close-enough-addon'</li>
<li>Canvas addon: Update file referneces</li>
<li>Update canvas addon: Rename files and add README</li>
<li>Merge remote branch 'wwalser/composite'</li>
<li>Fix #142 - Backslash characters in messages should not be escaped</li>
<li>Add module name to testStart and testDone callbacks</li>
<li>Removed extra columns in object literals. Closes #153</li>
<li>Remove dead links in comments.</li>
<li>Merge remote branch 'wwalser/multipleCallbacks'</li>
<li>Fixed syntax error and CommonJS incompatibilities in package.json</li>
<li>Allow multiple callbacks to be registered.</li>
<li>Add placeholder for when Safari may end up providing useful error handling</li>
<li>changed file names to match addon naming convention</li>
<li>Whitespace</li>
<li>Created the composite addon.</li>
<li>Using array and object literals.</li>
<li>Issue #140: Make toggle system configurable.</li>
<li>Merge remote branch 'tweetdeck/master'</li>
<li>Adds the 'close enough' addon to determine if numbers are acceptably close enough in value.</li>
<li>Fix recursion support in jsDump, along with tests. Fixes #63 and #100</li>
<li>Adding a QUnit.config.altertitle flag which will allow users to opt-out of the functionality introduced in 60147ca0164e3d810b8a9bf46981c3d9cc569efc</li>
<li>Refactor window.load handler into QUnit.load, makes it possible to call it manually.</li>
<li>More whitespace cleanup</li>
<li>Merge remote branch 'erikvold/one-chk-in-title'</li>
<li>Whitespace</li>
<li>Merge remote branch 'wwalser/syncStopCalls'</li>
<li>Introducing the first QUnit addon, based on <a href="https://github.com/jquery/qunit/pull/84">https://github.com/jquery/qunit/pull/84</a> - adds QUnit.pixelEqual assertion method, along with example tests.</li>
<li>Remove config.hidepassed setting in test.js, wasn't intended to land in master.</li>
<li>Expose QUnit.config.hidepassed setting. Overrides sessionStorage and enables enabling the feature programmatically. Fixes #133</li>
<li>Fix formatting (css whitespace) for tracebacks.</li>
<li>Expose extend, id, and addEvent methods.</li>
<li>minor comment typo correction</li>
<li>Ignore Eclipse WTP .settings</li>
<li>Set 'The jQuery Project' as author in package.json</li>
<li>Fixes a bug where synchronous calls to stop would cause tests to end before start was called again</li>
<li>Point to planning testing wiki in readme</li>
<li>only add one checkmark to the document.title</li>
<li>Escape the stacktrace output before setting it as innerHTML, since it tends to contain <code>&lt;</code> and <code>&gt;</code> characters.</li>
<li>Cleanup whitespace</li>
<li>Run module.teardown before checking for pollution. Fixes #109 - noglobals should run after module teardown</li>
<li>Fix accidental global variable "not"</li>
<li>Update document.title status to use more robust unicode escape sequences, works even when served with non-utf-8-charset.</li>
<li>Modify document.title when suite is done to show success/failure in tab, allows you to see the overall result without seeing the tab content.</li>
<li>Merge pull request #107 from sexyprout/master</li>
<li>Set a generic font</li>
<li>Add/update headers</li>
<li>Drop support for deprecated #main in favor of #qunit-fixture. If this breaks your testsuite, replace id="main" with id="qunit-fixture". Fixes #103</li>
<li>Remove the same key as the one being set. Partial fix for #101</li>
<li>Don't modify expected-count when checking pollution. The failing assertion isn't expected, so shouldn't be counted. And if expect wasn't used, the count is misleading.</li>
<li>Fix order of noglobals check to produce correct introduced/delete error messages</li>
<li>Prepend module name to sessionStorage keys to avoid conflicts</li>
<li>Store filter-tests only when checked</li>
<li>Write to sessionStorage only bad tests</li>
<li>Moved QUnit.url() defintion after QUnit properties are merged into the global scope. Fixes #93 - QUnit url/extend function breaking urls in jQuery ajax test component</li>
<li>Add a "Rerun" link to each test to replce the dblclick (still supported, for now).</li>
<li>Fixed the regex for parsing the name of a test when double clicking to filter.</li>
<li>Merge remote branch 'scottgonzalez/url'</li>
<li>Added checkboxes to show which flags are currently on and allow toggling them.</li>
<li>Retain all querystring parameters when filtering a test via double click.</li>
<li>Added better querystring parsing. Now storing all querystring params in QUnit.urlParams so that we can carry the params forward when filtering to a specific test. This removes the ability to specify multiple filters.</li>
<li>Make reordering optional (QUnit.config.reorder = false) and optimize "Hide passed tests" mode by also hiding "Running [testname]" entries.</li>
<li>Added missing semicolons and wrapped undefined key in quotes.</li>
<li>Optimize test hiding, add class on page load if stored in sessionStorage</li>
<li>Optimize the hiding of passed tests.</li>
<li>Position test results above test list, making it visible without ever having to scroll. Create a placeholder to avoid pushing down results later.</li>
<li>Don't check for existing qunit-testresult element, it gets killed on init anyway.</li>
<li>Added URL flag ?notrycatch (ala ?noglobals) for debugging exceptions. Won't try/catch test code, giving better debugging changes on the original exceptions. Fixes #72</li>
<li>Always show quni-toolbar (if at all specified), persist checkbox via sessionStorage. Fixes #47</li>
<li>Use non-html testname for calls to fail(). Fixes #77</li>
<li>Overhaul of QUnit.callbacks. Consistent single argument with related properties, with additonal runtime property for QUnit.done</li>
<li>Extended test/logs.html to capture more of the callbacks.</li>
<li>Fixed moduleStart/Done callbacks. Added test/logs.html to test these callbacks. To be extended.</li>
<li>Update copyright and license header. Fixes #61</li>
<li>Formatting fix.</li>
<li>Use a semaphore to synchronize stop() and start() calls. Fixes #76</li>
<li>Merge branch 'master' of <a href="https://github.com/paulirish/qunit">https://github.com/paulirish/qunit</a> into paulirish-master</li>
<li>Added two tests for previous QUnit.raises behaviour. For #69</li>
<li>add optional 2. arg to QUnit.raises #69.</li>
<li>fix references inside Complex Instances Nesting to what was originally intended.</li>
<li>Qualify calls to ok() in raises() for compability with CLI enviroments.</li>
<li>Fix done() handling, check for blocking, not block property</li>
<li>Fix moduleStart/Done and done callbacks.</li>
<li>Replacing sessionStorage test with the one from Modernizr/master (instead of current release). Here's hoping it'll work for some time.</li>
<li>Updated test for availibility of sessionStorage, based on test from Modernizr. Fixes #64</li>
<li>Defer test execution when previous run passed, persisted via sessionStorage. Fixes #49</li>
<li>Refactored module handling and queuing to enable selective defer of test runs.</li>
<li>Move assertions property from config to Test</li>
<li>Move expected-tests property from config to Test</li>
<li>Refactored test() method to delegate to a Test object to encapsulate all properties and methods of a single test, allowing further modifications.</li>
<li>Adding output of sourcefile and linenumber of failed assertions (except ok()). Only limited cross-browser support for now. Fixes #60</li>
<li>Drop 'hide missing tests' feature. Fixes #48</li>
<li>Adding readme. Fixes #58</li>
<li>Merge branch 'prettydiff'</li>
<li>Improve jsDump output with formatted diffs.</li>
<li>Cleanup whitespace</li>
<li>Cleanup whitespace</li>
<li>Added additional guards around browser specific code and cleaned up jsDump code</li>
<li>Added guards around tests which are only for browsers</li>
<li>cleaned up setTimeout undefined checking and double done on test finish</li>
<li>fixing .gitignore</li>
<li>making window setTimeout query more consistent</li>
<li>Moved expect-code back to beginning of function, where it belongs. Fixes #52</li>
<li>Bread crumb in header: Link to suite without filters, add link to current page based on the filter, if present. Fixes #50</li>
<li>Make the toolbar element optional when checking for show/hide of test results. Fixes #46</li>
<li>Adding headless.html to manually test logging and verify that QUnit works without output elements. Keeping #qunit-fixture as a few tests actually use that.</li>
<li>Fix for QUnit.moduleDone, get rid of initial bogus log. Fixes #33</li>
<li>Pass raw data (result, message, actual, expected) as third argument to QUnit.log. Fixes #32</li>
<li>Dump full exception. Not pretty, but functional (see issue Pretty diff for pretty output). Fixes #31</li>
<li>Don't let QUnit.reset() cause assertions to run. Manually applied from Scott Gonzalez branch. Fixes #34</li>
<li>Added missing semicolons. Fixes #37</li>
<li>Show okay/failed instead of undefined. Fixes #38</li>
<li>Expose push as QUnit.push to build custom assertions. Fixes #39</li>
<li>Respect filter pass selection when writing new results. Fixes #43</li>
<li>Cleanup tests, removing asyncTest-undefined check and formatting</li>
<li>Reset: Fall back to innerHTML when jQuery isn't available. Fixes #44</li>
<li>Merge branch 'master' of github.com:jquery/qunit</li>
<li>reset doesn't exist here - fixes #28.</li>
<li>- less css cruft, better readability - replaced inline style for test counts with "counts" class - test counts now use a "failed"/"passed" vs "pass"/"fail", shorter/more distinct selectors - pulled all test counts styling together and up (they're always the same regardless of section pass/fail state)</li>
<li>Adding .gitignore file</li>
<li>Removing diff test - diffing works fine, as the browser collapses whitespace in its output, but the test can't do that and isn't worth fixing.</li>
<li>Always synchronize the done-step (it'll set the timeout when necessary), fixes timing race conditions.</li>
<li>Insert location.href as an anchor around the header. Fixes issue #29</li>
<li>- kill double ;; in escapeHtml. oops</li>
<li>Removed html escaping from QUnit.diff, as input is already escaped, only leads to double escaping. Replaced newlines with single whitespace.</li>
<li>Optimized and cleaned up CSS file</li>
<li>Making the reset-method non-global (only module, test and assertions should be global), and fixing the fixture reset by using jQuery's html() method again, doesn't work with innerHTML, yet</li>
<li>Introducing #qunit-fixture element, deprecating the (never documented) #main element. Doesn't require inline styles and is now independent of jQuery.</li>
<li>Ammending previous commit: Remove jQuery-core specific resets (will be replaced within jQuery testsuite). Fixes issue #19 - QUnit.reset() removes global jQuery ajax event handlers</li>
<li>Remove jQuery-core specific resets (will be replaced within jQuery testsuite). Fixes issue #19 - QUnit.reset() removes global jQuery ajax event handlers</li>
<li>Cleaning up rubble from the previous commit.</li>
<li>Added raises assertion, reusing some of kennsnyder's code.</li>
<li>Merged kensnyder's object detection code. Original message: Streamlined object detection and exposed QUnit.objectType as a function.</li>
<li>Fixed some bad formatting.</li>
<li>Move various QUnit properties below the globals-export to avoid init becoming a global method. Fixes issue #11 - Remove 'init' function from a global namespace</li>
<li>Improved output when expected != actual: Output both only then, and add a diff. Fixes issue #10 - Show diff if equal() or deepEqual() failed</li>
<li>Expand failed tests on load. Fixes issue #8 - Failed tests expanded on load</li>
<li>Set location.search for url-filtering instead of location.href. Fixes issue #7 - Modify location.search instead of location.href on test double-click</li>
<li>Add QUnit.begin() callback. Fixes issue #6 - Add 'start' callback.</li>
<li>add css style for result (".test-actual") in passed tests</li>
<li>Fixed output escaping by using leeoniya's custom escaping along with innerHTML. Also paves the way for outputting diffs.</li>
<li>Cleanup</li>
<li>Revert "Revert part of bad merge, back to using createTextNode"</li>
<li>Revert part of bad merge, back to using createTextNode</li>
<li>Fixed doubleclick-handler and filtering to rerun only a single test.</li>
<li>Add ability to css style a test's messages, expected and actual results. Merged from Leon Sorokin (leeoniya).</li>
<li>Remove space between module name and colon</li>
<li>- removed "module" wording from reports (unneeded and cluttery) - added and modified css to make module &amp; test names styleable</li>
<li>Logging support for  Each test can extend the module testEnvironment</li>
<li>Fixing whitespace</li>
<li>Update tests to use equal() and deepEqual() rather than the deprecated equals() and same()</li>
<li>Consistent argument names for deepEqual</li>
<li>Skip DOM part of jsDump test if using a SSJS environment without a DOM</li>
<li>Improve async testing by creating the result element before running the test, updating it later. If the test fails, its clear which test is the culprit.</li>
<li>Add autostart option to config. Set via QUnit.config.autostart = false; start later via QUnit.start()</li>
<li>Expose QUnit.config, but don't make config a global</li>
<li>Expose QUnit.config as global to make external workarounds easier</li>
<li>Merge branch 'asyncsetup'</li>
<li>Allowing async setup and teardown. Fixes <a href="http://github.com/jquery/qunit/issues#issue/20">http://github.com/jquery/qunit/issues#issue/20</a>
</li>
<li>Always output expected and actual result (no reason not to). Fixes <a href="http://github.com/jquery/qunit/issues#issue/21">http://github.com/jquery/qunit/issues#issue/21</a>
</li>
<li>More changes to the detection of types in jsDump's typeOf.</li>
<li>Change the typeOf checks in QUnit to be more accurate.</li>
<li>Added test for jsDump and modified its options to properly output results when document.createTextNode is used; currently tests for DOM elements cause a stackoverflow error in IEs, works fine, with the correct output, elsewhere</li>
<li>Always use jsDump to output result objects into messages, making the output for passing assertions more useful</li>
<li>Make it so that the display is updated, at least, once a second - also prevents scripts from executing for too long and causing problems.</li>
<li>added tests and patch for qunit.equiv to avoid circular references in objects and arrays</li>
<li>No reason to continue looping, we can stop at this point. Thanks to Chris Thatcher for the suggestion.</li>
<li>Use createTextNode instead of innerHTML for showing test result since expected and actual might be something that looks like a tag.</li>
<li>'Test card' design added</li>
<li>switched green to blue for top-level pass + reduced padding</li>
<li>Bringing the QUnit API in line with the CommonJS API.</li>
<li>Explicitly set list-style-position: inside on result LIs.</li>
<li>Madness with border-radius.</li>
<li>Corrected banner styles for new class names</li>
<li>Added rounded corners and removed body rules for embedded tests</li>
<li>Resolving merge conflicts.</li>
<li>added colouring for value summary</li>
<li>adding some extra text colours</li>
<li>added styles for toolbar</li>
<li>added new styles</li>
<li>IE 6 and 7 weren't respecting the CSS rules for the banner, used a different technique instead.</li>
<li>Went a bit further and made extra-sure that the target was specified correctly.</li>
<li>Fixed problem where double-clicking an entry in IE caused an error to occur.</li>
<li>Path for <a href="http://dev.jquery.com/ticket/5426">http://dev.jquery.com/ticket/5426</a> - fix the microformat test result</li>
<li>Fixed test() to use 'expected' 2nd param</li>
<li>Remove the named function expressions, to stop Safari 2 from freaking out. Fixes #5.</li>
<li>Each test can extend the module testEnvironment</li>
<li>Extra test for current test environment</li>
<li>Make the current testEnvironment available to utility functions</li>
<li>typeOf in QUnit.jsDump now uses QUnit.is</li>
<li>hoozit in QUnit.equiv now uses QUnit.is</li>
<li>Properly set label attributes.</li>
<li>Some minor tweaks to RyanS' GETParams change.</li>
<li>left a console.log in :(</li>
<li>Took into account a fringe case when using qunit with testswarm. Trying to run all the tests with the extra url params from testswarm would make qunit look for a testsuite that did not exist</li>
<li>need to set config.currentModule to have correct names and working filters</li>
<li>Support logging of testEnvironment</li>
<li>async tests aren't possible on rhino</li>
<li>Fixed a missing QUnit.reset().</li>
<li>The QUnit. prefix was missing from the uses of the start() method.</li>
<li>Merged lifecycle object into testEnvironment</li>
<li>"replacing totally wrong diff algorithm with a working one" Patch from kassens (manually applied).</li>
<li>fixing jslint errors in test.js</li>
<li>Fixed: testDone() was always called with 0 failures in CommonJS mode</li>
<li>Fixed: moduleDone() was invoked on first call to module()</li>
<li>Added a new asyncTest method - removes the need for having to call start() at the beginning of an asynchronous test.</li>
<li>Added support for expected numbers in the test method.</li>
<li>Fixed broken dynamic loading of tests (can now dynamically load tests and done still works properly).</li>
<li>Simplified the logic for calling 'done' and pushing off new tests - was causing too many inconsistencies otherwise.</li>
<li>Simplified the markup for the QUnit test test suite.</li>
<li>Realized that it's really easy to handle the case where stop() has been called and then an exception is thrown.</li>
<li>Added in better logging support. Now handle moduleStart/moduleDone and testStart/testDone. Also make sure that done only fires once at the end.</li>
<li>Made it so that you can reset the suite to an initial state (at which point tests can be dynamically loaded and run, for example).</li>
<li>Re-worked QUnit to handle dynamic loading of additional code (the 'done' code will be re-run after additional code is loaded).</li>
<li>Removed the old SVN version stuff.</li>
<li>Moved the QUnit source into a separate directory and updated the test suite/packages files.</li>
<li>Added in CommonJS support for exporting the QUnit functionality.</li>
<li>Missing quote from package.json.</li>
<li>Fixed trailing comma in package.json.</li>
<li>Added a CommonJS/Narwhal package.json file.</li>
<li>Accidentally reverted the jsDump/equiv changes that had been made.</li>
<li>Hide the filter toolbar if it's not needed. Also exposed the jsDump and equiv objects on QUnit.</li>
<li>Retooled the QUnit CSS to be more generic.</li>
<li>Renamed the QUnit files from testrunner/testsuite to QUnit.</li>
<li>Expose QUnit.equiv and QUnit.jsDump in QUnit.</li>
<li>Moved the QUnit test directory into the QUnit directory.</li>
<li>Reworked the QUnit CSS (moved jQuery-specific stuff out, made all the other selectors more specific).</li>
<li>Removed the #main reset for non-jQuery code (QUnit.reset can be overwritten with your own reset code).</li>
<li>Moved the QUnit toolbar inline.</li>
<li>Switched to using a qunit- prefix for special elements (banner, userAgent, and tests).</li>
<li>Missed a case in QUnit where an element was assumed to exist.</li>
<li>QUnit's isSet and isObj are no longer needed - you should use same instead.</li>
<li>Make sure that QUnit's equiv entity escaping is enabled by default (otherwise the output gets kind of crazy).</li>
<li>Refactored QUnit, completely reorganized the structure of the file. Additionally made it so that QUnit can run outside of a browser (inside Rhino, for example).</li>
<li>Removed some legacy and jQuery-specific test methods.</li>
<li>Added callbacks for tests and modules. It's now possible to reproduce the full display of the testrunner without using the regular rendering.</li>
<li>QUnit no longer depends upon rendering the results (it can work simply by using the logging callbacks).</li>
<li>Made QUnit no longer require jQuery (it is now a standalone, framework independent, test runner).</li>
<li>Reverted the noglobals changed from QUnit - causing chaos in the jQuery test suite.</li>
<li>qunit: removed noglobals flag, instead always check for globals after teardown; if a test has to introduce a global "myVar", use delete window.myVar in teardown or at the end of a test</li>
<li>qunit: don't child selectors when IE should behave nicely, too</li>
<li>qunit: improvment for the test-scope: create a new object and call setup, the test, and teardown in the scope of that object - allows you to provide test fixtures to each test without messing with global data; kudos to Martin Häcker for the contribution</li>
<li>qunit: added missing semicolons</li>
<li>qunit: fixed a semicolon, that should have been a comma</li>
<li>QUnit: implemented error handling for Opera as proposed by #3628</li>
<li>qunit: fix for <a href="http://dev.jquery.com/ticket/3215">http://dev.jquery.com/ticket/3215</a> changing wording of testresults, to something more positive (x of y passed, z failed)</li>
<li>QUnit: testrunner.js: Ensures equality of types (String, Boolean, Number) declared with the 'new' prefix. See comments #3, #4 and #5 on <a href="http://philrathe.com/articles/equiv">http://philrathe.com/articles/equiv</a>
</li>
<li>qunit: wrap name of test in span when a module is used for better styling</li>
<li>qunit: auto-prepend default mark (#header, #banner, #userAgent, #tests) when not present</li>
<li>Landing some changes to add logging to QUnit (so that it's easier to hook in to when a test finishes).</li>
<li>Added checkbox for hiding missing tests (tests that fail with the text 'missing test - untested code is broken code')</li>
<li>qunit: eol-style:native and mime-type</li>
<li>HTML being injected for the test result wasn't valid HTML.</li>
<li>qunit: setting mimetype for testsuite.css</li>
<li>qunit: update to Ariel's noglobals patch to support async tests as well</li>
<li>Landing Ariel's change - checks for global variable leakage.</li>
<li>qunit: run module-teardown in its own synchronize block to synchronize with async tests (ugh)</li>
<li>qunit: same: equiv - completely refactored in the testrunner.</li>
<li>testrunner.js:     - Update equiv to support Date and RegExp.     - Change behavior when comparing function:         - abort when in an instance of Object (when references comparison failed)         - skip otherwise (like before)</li>
<li>qunit: code refactoring and cleanup</li>
<li>QUnit: update equiv to latest version, handling multiple arguments and NaN, see <a href="http://philrathe.com/articles/equiv">http://philrathe.com/articles/equiv</a>
</li>
<li>QUnit: cleanup, deprecating compare, compare2 and serialArray: usage now throws an error with a helpful message</li>
<li>QUnit: optional timeout argument for stop, while making tests undetermined, useful for debugging</li>
<li>QUnit: added toolbar with "hide passed tests" checkbox to help focus on failed tests</li>
<li>QUnit: minor output formatting</li>
<li>QUnit: adding same-assertion for a recursive comparsion of primite values, arrays  and objects, thanks to Philippe Rathé for the contribution, including tests</li>
<li>QUnit: adding same-assertion for a recursive comparsion of primite values, arrays  and objects, thanks to Philippe Rathé for the contribution, including tests</li>
<li>QUnit: adding same-assertion for a recursive comparsion of primite values, arrays  and objects, thanks to Philippe Rathé for the contribution, including tests</li>
<li>qunit: use window.load to initialize tests, allowing other code to run on document-ready before starting to run tests</li>
<li>qunit: allow either setup or teardown, instead of both or nothing</li>
<li>qunit: make everything private by default, expose only public API; removed old timeout-option (non-deterministic, disabled for a long time anyway); use local $ reference instead of global jQuery reference; minor code cleanup (var config instead of _config; queue.shift instead of slice)</li>
<li>qunit: added support for module level setup/teardown callbacks</li>
<li>qunit: modified example for equals to avoid confusion with parameter ordering</li>
<li>qunit: added id/classes to result element to enable integration with browser automation tools, see <a href="http://docs.jquery.com/QUnit#Integration_into_Browser_Automation_Tools">http://docs.jquery.com/QUnit#Integration_into_Browser_Automation_Tools</a>
</li>
<li>qunit: replaced $ alias with jQuery (merged from jquery/test/data/testrunner.js)</li>
<li>qunit: fixed inline documentation for equals</li>
<li>qunit testrunner - catch and log possible error during reset()</li>
<li>QUnit: Switched out Date and Rev for Id.</li>
<li>qunit: when errors are thrown in a test, the message is successfully show on all browsers.</li>
<li>qunit: added license header</li>
<li>qunit: moved jquery testrunner to top-level project, see <a href="http://docs.jquery.com/QUnit">http://docs.jquery.com/QUnit</a>
</li>
<li>Share project 'qunit' into '<a href="https://jqueryjs.googlecode.com/svn">https://jqueryjs.googlecode.com/svn</a>'</li>
</ul></article>
  </div>

          </div>
        </div>

        <a href="#jump-to-line" rel="facebox" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
        <div id="jump-to-line" style="display:none">
          <h2>Jump to Line</h2>
          <form accept-charset="UTF-8" class="js-jump-to-line-form">
            <input class="textfield js-jump-to-line-field" type="text">
            <div class="full-button">
              <button type="submit" class="button">Go</button>
            </div>
          </form>
        </div>

      </div>
    </div>
</div>

<div id="js-frame-loading-template" class="frame frame-loading large-loading-area" style="display:none;">
  <img class="js-frame-loading-spinner" src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-128.gif?1360648847" height="64" width="64">
</div>


        </div>
      </div>
      <div class="modal-backdrop"></div>
    </div>

      <div id="footer-push"></div><!-- hack for sticky footer -->
    </div><!-- end of wrapper - hack for sticky footer -->

      <!-- footer -->
      <div id="footer">
  <div class="container clearfix">

      <dl class="footer_nav">
        <dt>GitHub</dt>
        <dd><a href="https://github.com/about">About us</a></dd>
        <dd><a href="https://github.com/blog">Blog</a></dd>
        <dd><a href="https://github.com/contact">Contact &amp; support</a></dd>
        <dd><a href="http://enterprise.github.com/">GitHub Enterprise</a></dd>
        <dd><a href="http://status.github.com/">Site status</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Applications</dt>
        <dd><a href="http://mac.github.com/">GitHub for Mac</a></dd>
        <dd><a href="http://windows.github.com/">GitHub for Windows</a></dd>
        <dd><a href="http://eclipse.github.com/">GitHub for Eclipse</a></dd>
        <dd><a href="http://mobile.github.com/">GitHub mobile apps</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Services</dt>
        <dd><a href="http://get.gaug.es/">Gauges: Web analytics</a></dd>
        <dd><a href="http://speakerdeck.com">Speaker Deck: Presentations</a></dd>
        <dd><a href="https://gist.github.com">Gist: Code snippets</a></dd>
        <dd><a href="http://jobs.github.com/">Job board</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Documentation</dt>
        <dd><a href="http://help.github.com/">GitHub Help</a></dd>
        <dd><a href="http://developer.github.com/">Developer API</a></dd>
        <dd><a href="http://github.github.com/github-flavored-markdown/">GitHub Flavored Markdown</a></dd>
        <dd><a href="http://pages.github.com/">GitHub Pages</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>More</dt>
        <dd><a href="http://training.github.com/">Training</a></dd>
        <dd><a href="https://github.com/edu">Students &amp; teachers</a></dd>
        <dd><a href="http://shop.github.com">The Shop</a></dd>
        <dd><a href="/plans">Plans &amp; pricing</a></dd>
        <dd><a href="http://octodex.github.com/">The Octodex</a></dd>
      </dl>

      <hr class="footer-divider">


    <p class="right">&copy; 2013 <span title="0.06190s from fe4.rs.github.com">GitHub</span>, Inc. All rights reserved.</p>
    <a class="left" href="https://github.com/">
      <span class="mega-octicon octicon-mark-github"></span>
    </a>
    <ul id="legal">
        <li><a href="https://github.com/site/terms">Terms of Service</a></li>
        <li><a href="https://github.com/site/privacy">Privacy</a></li>
        <li><a href="https://github.com/security">Security</a></li>
    </ul>

  </div><!-- /.container -->

</div><!-- /.#footer -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
          <div class="suggester-container">
              <div class="suggester fullscreen-suggester js-navigation-container" id="fullscreen_suggester"
                 data-url="/jquery/qunit/suggestions/commit">
              </div>
          </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped leftwards" title="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped leftwards"
      title="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      Something went wrong with that request. Please try again.
      <a href="#" class="octicon octicon-remove-close ajax-error-dismiss"></a>
    </div>

    
    
    <span id='server_response_time' data-time='0.06226' data-host='fe4'></span>
    
  </body>
</html>

