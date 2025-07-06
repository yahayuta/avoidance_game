VERSION 5.00
Begin VB.Form MainForm 
   BorderStyle     =   1  '固定(実線)
   Caption         =   "MainForm"
   ClientHeight    =   3315
   ClientLeft      =   4995
   ClientTop       =   2460
   ClientWidth     =   3990
   Icon            =   "MainForm.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   221
   ScaleMode       =   3  'ﾋﾟｸｾﾙ
   ScaleWidth      =   266
   Begin VB.PictureBox ShotPicture 
      AutoRedraw      =   -1  'True
      AutoSize        =   -1  'True
      BackColor       =   &H00000000&
      Height          =   210
      Left            =   0
      Picture         =   "MainForm.frx":030A
      ScaleHeight     =   10
      ScaleMode       =   3  'ﾋﾟｸｾﾙ
      ScaleWidth      =   10
      TabIndex        =   3
      Top             =   360
      Visible         =   0   'False
      Width           =   210
   End
   Begin VB.Timer Bgm_Check 
      Interval        =   1000
      Left            =   720
      Top             =   0
   End
   Begin VB.PictureBox B_Crt 
      AutoRedraw      =   -1  'True
      BackColor       =   &H00000000&
      Height          =   375
      Left            =   360
      ScaleHeight     =   21
      ScaleMode       =   3  'ﾋﾟｸｾﾙ
      ScaleWidth      =   21
      TabIndex        =   2
      Top             =   0
      Visible         =   0   'False
      Width           =   375
   End
   Begin VB.PictureBox Chr 
      AutoRedraw      =   -1  'True
      AutoSize        =   -1  'True
      BackColor       =   &H00000000&
      Height          =   540
      Left            =   0
      Picture         =   "MainForm.frx":07C4
      ScaleHeight     =   480
      ScaleWidth      =   3840
      TabIndex        =   1
      Top             =   600
      Visible         =   0   'False
      Width           =   3900
   End
   Begin VB.PictureBox Crt 
      BackColor       =   &H00000000&
      ForeColor       =   &H00FFFFFF&
      Height          =   375
      Left            =   0
      ScaleHeight     =   21
      ScaleMode       =   3  'ﾋﾟｸｾﾙ
      ScaleWidth      =   21
      TabIndex        =   0
      Top             =   0
      Width           =   375
   End
End
Attribute VB_Name = "MainForm"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub Bgm_Check_Timer()
'ＢＧＭの演奏チェックと繰り返しの処理
    
    Dim MciStatus As String 'メッセージ受け取り用変数の型定義
     
    '戻り値の長さ
    StatusLen = 15
    
    'status格納変数にスペース代入
    MciStatus = String$(StatusLen + 1, " ")
    
    '停止中のときは、演奏を再開する
    If (UCase$(Left$(MciStatus, 7)) = "STOPPED") And (BGM_Flag = True) Then
        Ret = mciSendString("seek MIDI to start", vbNullString, 0, 0)
        Ret = mciSendString("play MIDI from 0", vbNullString, 0, 0)
    End If

End Sub

Private Sub Form_Load()

'▼以下の部分にフォームの外見的な調整のコードを記述して下さい。
        
    'メイン画面となるPictureBoxの調整
    Crt.AutoRedraw = True
    Crt.ScaleMode = 3
    'メイン画面の大きさの設定
    Crt.Width = CrtWidth + 4
    Crt.Height = CrtHeight + 4
    
    '裏画面用ピクチャボックスの設定
    B_Crt.Width = Crt.Width
    B_Crt.Height = Crt.Height
    
    '実際のアプリケーションのタイトルに変更して下さい
    MainForm.Caption = "講座その①　「避けゲー」"
    'フォームの大きさをメインのピクチャボックスに合わせる
    MainForm.Width = (Crt.Width + 6) * Screen.TwipsPerPixelX
    MainForm.Height = (Crt.Height + 24) * Screen.TwipsPerPixelY
    
        
    
'▲ここまで。
    
    '初期表示位置を画面上のセンターへ移動
    If WindowState = 0 Then
        Move (Screen.Width - MainForm.Width) / 2, (Screen.Height - MainForm.Height) / 2
    End If
        
End Sub

Private Sub Form_Unload(Cancel As Integer)
'アプリケーション終了処理
    
    'ＢＧＭファイルをクローズする
    BGM_CLOSE
    End
    
End Sub
