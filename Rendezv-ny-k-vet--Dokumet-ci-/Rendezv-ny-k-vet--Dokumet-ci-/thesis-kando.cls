%%
%% This is file `thesis-kando.cls',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% ./thesis-kando.dtx  (with options: `class')
%% This is a generated file.
%% Copyright (C) 2014-2024 by Tibor Tomacs
%% This file may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either
%% version 1.2 of this license or (at your option) any later
%% version. The latest version of this license is in:
%% 
%% http://www.latex-project.org/lppl.txt
%% 
%% and version 1.2 or later is part of all distributions of
%% LaTeX version 1999/12/01 or later.
%% 

\NeedsTeXFormat{LaTeX2e}[1999/12/01]
\ProvidesClass{thesis-kando}[2024/04/18 v4.5 Thesis class for Eszterhazy Karoly Catholic University (Eger, Hungary)]

\RequirePackage{kvoptions}
\SetupKeyvalOptions{family=thesis-kando,prefix=thesiskando@}
\DeclareVoidOption{twoside}{\PassOptionsToClass{twoside}{report}}
\DeclareVoidOption{colorlinks}{\PassOptionsToPackage{colorlinks}{hyperref}}
\DeclareBoolOption{times}
\DeclareBoolOption{upint}
\DeclareBoolOption{logodown}
\DeclareBoolOption{tocnopagenum}
\DeclareBoolOption{reverseorder}
\DeclareBoolOption[true]{centeredchapter}
\DeclareBoolOption[true]{warning}
\DeclareVoidOption{10pt}{\def\thesiskando@fontsize@{10pt}}
\DeclareVoidOption{11pt}{\def\thesiskando@fontsize@{11pt}}
\DeclareVoidOption{12pt}{\def\thesiskando@fontsize@{12pt}}
\DeclareStringOption{fontsize}
\DeclareStringOption[10mm]{institutesep}
\DeclareStringOption[0mm]{logosep}
\DeclareStringOption[\stretch{1.4}]{titlesep}
\DeclareStringOption[15mm]{authorsep}
\DeclareStringOption[5mm]{hminsep}
\DeclareStringOption[10mm]{authorxmargin}
\DeclareStringOption[0mm]{captionsep}
\DeclareStringOption[2mm]{collcaptionsep}
\DeclareStringOption[left]{authoralign}
\DeclareStringOption[left]{supervisoralign}
\DeclareStringOption[\large\scshape]{institutefont}
\DeclareStringOption[\large\scshape]{logofont}
\DeclareStringOption[\Huge\bfseries]{titlefont}
\DeclareStringOption[\large]{authorfont}
\DeclareStringOption[\large\bfseries]{captionfont}
\DeclareStringOption[\large\scshape]{cityfont}
\DeclareStringOption[\large\scshape]{datefont}
\DeclareStringOption[,~]{datesep}
\def\thesiskando@fontsize@{12pt}
\ProcessKeyvalOptions{thesis-kando}

\InputIfFileExists{thesis-kando.cfg}{}{}

\def\thesiskando@ten{10pt}
\def\thesiskando@eleven{11pt}
\def\thesiskando@twelve{12pt}
\ifx\thesiskando@fontsize\thesiskando@ten
    \def\thesiskando@fontsize@{10pt}
\fi
\ifx\thesiskando@fontsize\thesiskando@eleven
    \def\thesiskando@fontsize@{11pt}
\fi
\ifx\thesiskando@fontsize\thesiskando@twelve
    \def\thesiskando@fontsize@{12pt}
\fi

\LoadClass[\thesiskando@fontsize@]{report}
\RequirePackage{setspace}
\RequirePackage[linktocpage,allcolors=blue,pdfstartview=FitH,bookmarksnumbered,pdfborder={0 0 0}]{hyperref}
\RequirePackage[a4paper,top=25mm,bottom=25mm,inner=30mm,outer=25mm]{geometry}
\ifthesiskando@times
    \ifthesiskando@upint
        \PassOptionsToPackage{upint}{newtxmath}
        \PassOptionsToPackage{intlimits}{amsmath}
    \fi
\else
    \RequirePackage{lmodern,fixcmex}
    \ifthesiskando@upint
        \RequirePackage{cmupint}
    \fi
\fi
\RequirePackage{graphicx,iftex}

\onehalfspacing

\AddToHook{begindocument/before}{

\ifthesiskando@times
    \RequirePackage{newtxtext,newtxmath}
\fi

\ifx\thesiskando@fontsize\@empty
\else
    \ifx\thesiskando@fontsize\thesiskando@ten
    \else
        \ifx\thesiskando@fontsize\thesiskando@eleven
        \else
            \ifx\thesiskando@fontsize\thesiskando@twelve
            \else
                \RequirePackage[fontsize=\thesiskando@fontsize]{fontsize}
            \fi
        \fi
    \fi
\fi

\RequirePackage{upquote}

}

\AddToHook{begindocument/end}{

\ifthesiskando@tocnopagenum
    \hypersetup{pageanchor=false}
    \let\thesiskando@tableofcontents\tableofcontents
    \def\tableofcontents{%
        \global\let\thesiskando@thepage\thepage%
        \global\let\thepage\empty%
        \thesiskando@tableofcontents%
        \clearpage%
        \global\c@page\@ne%
        \global\let\thepage\thesiskando@thepage%
        \hypersetup{pageanchor}}
\fi

\ifthesiskando@centeredchapter
    \let\thesiskando@makechapterhead\@makechapterhead
    \let\thesiskando@makeschapterhead\@makeschapterhead
    \let\thesiskando@raggedright\raggedright
    \def\@makechapterhead#1{
        \let\raggedright\centering
        \thesiskando@makechapterhead{#1}
        \let\raggedright\thesiskando@raggedright}
    \def\@makeschapterhead#1{
        \let\raggedright\centering
        \thesiskando@makeschapterhead{#1}
        \let\raggedright\thesiskando@raggedright}
\fi

\def\@dottedtocline#1#2#3#4#5{%
    \ifnum #1>\c@tocdepth \else
        \vskip \z@ \@plus.2\p@
        {\leftskip #2\relax \rightskip \@tocrmarg \parfillskip -\rightskip
         \parindent #2\relax\@afterindenttrue
         \interlinepenalty\@M
         \leavevmode
         \@tempdima #3\relax
         \advance\leftskip \@tempdima \null\nobreak\hskip -\leftskip
         {#4}\nobreak
         \leaders\hbox{$\m@th
            \mkern \@dotsep mu\hbox{.}\mkern \@dotsep
            mu$}\hfill
         \nobreak
         \hb@xt@\@pnumwidth{\hfil\normalfont \normalcolor #5}%
         \par}%
    \fi}

\renewcommand*\l@chapter[2]{%
    \ifnum \c@tocdepth >\z@
      \addpenalty\@secpenalty
      \addvspace{1.0em \@plus\p@}%
      \setlength\@tempdima{1.8em}%
      \begingroup
          \parindent \z@ \rightskip \@pnumwidth
          \parfillskip -\@pnumwidth
          \leavevmode \bfseries
          \advance\leftskip\@tempdima
          \hskip -\leftskip
          #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss #2}\par
      \endgroup
    \fi}
\renewcommand*\l@section{\@dottedtocline{1}{1.8em}{2.5em}}
\renewcommand*\l@subsection{\@dottedtocline{2}{4.3em}{3.2em}}

\if@thesiskando@nochanged@authorcaption@%
    \@ifundefined{l@magyar}{}{%
        \iflanguage{magyar}{\gdef\thesiskando@authorcaption{K\'{e}sz\'{\i}tette}}{}}%
    \@ifundefined{l@hungarian}{}{%
        \iflanguage{hungarian}{\gdef\thesiskando@authorcaption{K\'{e}sz\'{\i}tette}}{}}%
\fi

\if@thesiskando@nochanged@supervisorcaption@%
    \@ifundefined{l@magyar}{}{%
        \iflanguage{magyar}{\gdef\thesiskando@supervisorcaption{T\'{e}mavezet\H{o}}}{}}%
    \@ifundefined{l@hungarian}{}{%
        \iflanguage{hungarian}{\gdef\thesiskando@supervisorcaption{T\'{e}mavezet\H{o}}}{}}%
\fi

\if@thesiskando@nochanged@logo@%
    \@ifundefined{l@magyar}{}{%
        \iflanguage{magyar}{\if@thesiskando@exists@logo@hu@\gdef\thesiskando@logo{\includegraphics{kando-logo-hu}}\fi}{}}%
    \@ifundefined{l@hungarian}{}{%
        \iflanguage{hungarian}{\if@thesiskando@exists@logo@hu@\gdef\thesiskando@logo{\includegraphics{kando-logo-hu}}\fi}{}}%
\fi

}

\newif\if@thesiskando@nochanged@logo@
\@thesiskando@nochanged@logo@true
\def\logo#1{\@thesiskando@nochanged@logo@false\gdef\thesiskando@logo{#1}}
\def\thesiskando@logo{}
\newif\if@thesiskando@exists@logo@hu@
\ifpdf
    \IfFileExists{kando-logo-hu.pdf}{\@thesiskando@exists@logo@hu@true}{}
\else
    \IfFileExists{kando-logo-hu.eps}{\@thesiskando@exists@logo@hu@true}{}
\fi
\def\thesiskando@logo@{%
    \thesiskando@logo%
    \ifx\thesiskando@logo\@empty%
        \ifthesiskando@warning%
            \ClassWarning{thesis-kando}{logo is missing}%
        \fi%
    \fi}

\def\institute#1{\gdef\thesiskando@institute{#1}}
\institute{}
\def\thesiskando@institute@{%
    \thesiskando@institute%
    \ifx\thesiskando@institute\@empty%
        \ifthesiskando@warning%
            \ClassWarning{thesis-kando}{institute is missing}%
        \fi%
    \fi}

\def\title#1{\gdef\thesiskando@title{#1}}
\title{}
\def\thesiskando@title@{%
    \thesiskando@title%
    \ifx\thesiskando@title\@empty%
        \ifthesiskando@warning%
            \ClassWarning{thesis-kando}{title is missing}%
        \fi%
    \fi}

\def\author#1{\gdef\thesiskando@author{#1}}
\author{}
\def\thesiskando@author@{%
    \ifx\thesiskando@authorcaption\@empty%
    \else%
        \ifx\thesiskando@author\@empty%
            \ifthesiskando@warning%
                \ClassWarning{thesis-kando}{author is missing}%
            \fi%
        \else%
            \thesiskando@author%
        \fi%
    \fi}

\newif\if@thesiskando@nochanged@authorcaption@
\@thesiskando@nochanged@authorcaption@true
\def\authorcaption#1{%
    \@thesiskando@nochanged@authorcaption@false%
    \gdef\thesiskando@authorcaption{#1}}
\def\thesiskando@authorcaption{Author}
\def\thesiskando@authorcaption@{%
    \ifx\thesiskando@author\@empty%
    \else%
        \ifx\thesiskando@authorcaption\@empty%
            \ifthesiskando@warning%
                \ClassWarning{thesis-kando}{authorcaption is missing}%
            \fi%
        \else%
            \thesiskando@authorcaption%
        \fi%
    \fi}

\def\supervisor#1{\gdef\thesiskando@supervisor{#1}}
\supervisor{}
\def\thesiskando@supervisor@{%
    \ifx\thesiskando@supervisorcaption\@empty
    \else
        \ifx\thesiskando@supervisor\@empty
            \ifthesiskando@warning
                \ClassWarning{thesis-kando}{supervisor is missing}
            \fi
        \else
            \thesiskando@supervisor
        \fi
    \fi}

\newif\if@thesiskando@nochanged@supervisorcaption@
\@thesiskando@nochanged@supervisorcaption@true
\def\supervisorcaption#1{%
    \@thesiskando@nochanged@supervisorcaption@false%
    \gdef\thesiskando@supervisorcaption{#1}}
\def\thesiskando@supervisorcaption{Supervisor}
\def\thesiskando@supervisorcaption@{%
    \ifx\thesiskando@supervisor\@empty%
    \else%
        \ifx\thesiskando@supervisorcaption\@empty%
            \ifthesiskando@warning%
                \ClassWarning{thesis-kando}{supervisorcaption is missing}%
            \fi%
        \else%
            \thesiskando@supervisorcaption%
        \fi%
    \fi}

\def\city#1{\gdef\thesiskando@city{#1}}
\city{}
\def\thesiskando@city@{%
    \thesiskando@city%
    \ifx\thesiskando@city\@empty%
        \ifthesiskando@warning%
            \ClassWarning{thesis-kando}{city is missing}%
        \fi%
    \fi}

\def\date#1{\gdef\thesiskando@date{#1}}
\date{\number\year}
\def\thesiskando@date@{%
    \thesiskando@date%
    \ifx\thesiskando@date\@empty%
        \ifthesiskando@warning%
            \ClassWarning{thesis-kando}{date is missing}%
        \fi%
    \fi}

\def\thesiskando@datesep@{%
    \ifx\thesiskando@city\@empty
    \else
        \ifx\thesiskando@date\@empty
        \else
            \thesiskando@datesep
        \fi
    \fi}

\def\thesiskando@box@logo{%
    \ifthesiskando@logodown%
        {\normalfont\normalsize\thesiskando@institutefont\thesiskando@institute@%
         \ifx\thesiskando@institute\@empty%
         \else%
             \\%
             \ifx\thesiskando@logo\@empty%
             \else%
                 \vspace{\thesiskando@institutesep}%
             \fi%
         \fi}%
        {\normalfont\normalsize\thesiskando@logofont\thesiskando@logo@%
         \ifx\thesiskando@logo\@empty%
         \else%
             \\%
         \fi}%
    \else%
        {\normalfont\normalsize\thesiskando@logofont\thesiskando@logo@%
         \ifx\thesiskando@logo\@empty%
         \else%
             \\%
             \ifx\thesiskando@institute\@empty%
             \else%
                 \vspace{\thesiskando@logosep}%
             \fi%
         \fi}%
        {\normalfont\normalsize\thesiskando@institutefont\thesiskando@institute@%
         \ifx\thesiskando@institute\@empty%
         \else%
             \\%
         \fi}%
    \fi%
    \vspace*{\fill}}

\def\thesiskando@box@title{%
    {\normalfont\normalsize\thesiskando@titlefont\thesiskando@title@%
     \ifx\thesiskando@title\@empty%
     \else%
         \par\vspace{\thesiskando@titlesep}%
     \fi}}

\def\thesiskando@align@center{center}
\def\thesiskando@align@left{left}
\def\thesiskando@align@right{right}

\def\thesiskando@box@author{%
    {\normalfont\normalsize\thesiskando@authorfont%
     \ifx\thesiskando@authoralign\thesiskando@align@center%
         \begin{tabular}[t]{@{}c@{}}%
     \fi%
     \ifx\thesiskando@authoralign\thesiskando@align@left%
         \begin{tabular}[t]{@{}l@{}}%
     \fi%
     \ifx\thesiskando@authoralign\thesiskando@align@right%
         \begin{tabular}[t]{@{}r@{}}%
     \fi%
     {\normalfont\normalsize\thesiskando@captionfont\thesiskando@authorcaption@}\\[\thesiskando@captionsep]%
     \thesiskando@author@%
     \end{tabular}}}

\def\thesiskando@box@supervisor{%
    {\normalfont\normalsize\thesiskando@authorfont%
     \ifx\thesiskando@supervisoralign\thesiskando@align@center%
         \begin{tabular}[t]{@{}c@{}}%
     \fi%
     \ifx\thesiskando@supervisoralign\thesiskando@align@left%
         \begin{tabular}[t]{@{}l@{}}%
     \fi%
     \ifx\thesiskando@supervisoralign\thesiskando@align@right%
         \begin{tabular}[t]{@{}r@{}}%
     \fi%
     {\normalfont\normalsize\thesiskando@captionfont\thesiskando@supervisorcaption@}\\[\thesiskando@captionsep]%
     \thesiskando@supervisor@%
     \end{tabular}}}

\def\thesiskando@box@author@supervisor@{%
    \hbox{}\nobreak\hspace*{\thesiskando@authorxmargin}%
    \ifthesiskando@reverseorder%
        \thesiskando@box@supervisor%
        \nobreak\hspace{\thesiskando@hminsep}\hfill%
        \thesiskando@box@author%
    \else%
        \thesiskando@box@author%
        \nobreak\hspace{\thesiskando@hminsep}\hfill%
        \thesiskando@box@supervisor%
    \fi%
    \nobreak\hspace{\thesiskando@authorxmargin}\hbox{}%
    \par\vspace{\thesiskando@authorsep}}

\def\thesiskando@box@author@supervisor{%
    \if\getrefnumber{@thesiskando@collaborator@}%
        \gdef\thesiskando@captionsep{\thesiskando@collcaptionsep}%
    \fi%
    \thesiskando@box@author@supervisor@%
    \gdef\@currentlabel{10}%
    \if@thesiskando@collaborator@%
        \gdef\@currentlabel{11}%
    \fi%
    \label{@thesiskando@collaborator@}}

\def\thesiskando@box@city@date{%
    {\normalfont\normalsize\thesiskando@cityfont\thesiskando@city@\thesiskando@datesep@}%
    {\normalfont\normalsize\thesiskando@datefont\thesiskando@date@}}

\newif\if@thesiskando@collaborator@

\newcommand{\collaborator}[1][]{%
    \global\@thesiskando@collaborator@true%
    \\[\thesiskando@captionsep]
    \def\thesiskando@temp{#1}%
    \ifx\thesiskando@temp\@empty%
    \else%
        {\normalfont\normalsize\thesiskando@captionfont#1}\\[\thesiskando@captionsep]%
    \fi}

\def\maketitle{
    \thispagestyle{empty}
    {\centering
     \thesiskando@box@logo%
     \thesiskando@box@title%
     \thesiskando@box@author@supervisor%
     \thesiskando@box@city@date%
     \par}
    \newpage
    \if@twoside
        \thispagestyle{empty}
        \hbox{}
        \newpage
    \fi}

\endinput
%%
%% End of file `thesis-kando.cls'.
