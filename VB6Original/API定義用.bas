Attribute VB_Name = "APIè`p"
'æ]p`ohÌè`
    
    Public Declare Function BitBlt Lib "GDI32" ( _
    ByVal hDC As Long, _
    ByVal X As Long, ByVal Y As Long, _
    ByVal nWidth As Long, _
    ByVal nHeight As Long, _
    ByVal hSrcDC As Long, _
    ByVal XSrc As Long, ByVal YSrc As Long, _
    ByVal dwRop As Long _
    ) As Long

    'X^Iy[VÌè`
    Public Const SrcCopy = &HCC0020
    Public Const SrcAnd = &H8800C6
    Public Const SrcPaint = &HEE0086

'L[{[hmÌ`ohÌè`

    Public Declare Function GetKeyState Lib "user32" ( _
    ByVal nVirtKey As Long _
    ) As Integer

    Public Declare Function GetAsyncKeyState Lib "user32" ( _
    ByVal vKey As Long _
    ) As Integer

'lhchyÑv`udt@CÌÄ¶p`ohÌè`

    Public Declare Function mciSendString Lib "winmm.dll" Alias "mciSendStringA" ( _
    ByVal CMD$, ByVal Ret$, ByVal RLen&, ByVal hWnd&) As Long

'EFCgÌ×Ì^C}[`ohÌè`

    Public Declare Function timeGetTime Lib "winmm.dll" () As Long

'øÊ¹TEhp`ohÌè`
    
    Public Declare Function sndPlaySound Lib "winmm.dll" Alias "sndPlaySoundA" _
    (ByVal lpszSoundName As String, ByVal uFlags As Long) As Long

    Public Const Snd_Sync = &H0
    Public Const Snd_Async = &H1
    Public Const Snd_Nodefault = &H2
    Public Const Snd_Memory = &H4
    Public Const Snd_Loop = &H8
    Public Const Snd_Nostop = &H10


