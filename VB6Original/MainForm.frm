VERSION 5.00
Begin VB.Form MainForm 
   BorderStyle     =   1  '�Œ�(����)
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
   ScaleMode       =   3  '�߸��
   ScaleWidth      =   266
   Begin VB.PictureBox ShotPicture 
      AutoRedraw      =   -1  'True
      AutoSize        =   -1  'True
      BackColor       =   &H00000000&
      Height          =   210
      Left            =   0
      Picture         =   "MainForm.frx":030A
      ScaleHeight     =   10
      ScaleMode       =   3  '�߸��
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
      ScaleMode       =   3  '�߸��
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
      ScaleMode       =   3  '�߸��
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
'�a�f�l�̉��t�`�F�b�N�ƌJ��Ԃ��̏���
    
    Dim MciStatus As String '���b�Z�[�W�󂯎��p�ϐ��̌^��`
     
    '�߂�l�̒���
    StatusLen = 15
    
    'status�i�[�ϐ��ɃX�y�[�X���
    MciStatus = String$(StatusLen + 1, " ")
    
    '��~���̂Ƃ��́A���t���ĊJ����
    If (UCase$(Left$(MciStatus, 7)) = "STOPPED") And (BGM_Flag = True) Then
        Ret = mciSendString("seek MIDI to start", vbNullString, 0, 0)
        Ret = mciSendString("play MIDI from 0", vbNullString, 0, 0)
    End If

End Sub

Private Sub Form_Load()

'���ȉ��̕����Ƀt�H�[���̊O���I�Ȓ����̃R�[�h���L�q���ĉ������B
        
    '���C����ʂƂȂ�PictureBox�̒���
    Crt.AutoRedraw = True
    Crt.ScaleMode = 3
    '���C����ʂ̑傫���̐ݒ�
    Crt.Width = CrtWidth + 4
    Crt.Height = CrtHeight + 4
    
    '����ʗp�s�N�`���{�b�N�X�̐ݒ�
    B_Crt.Width = Crt.Width
    B_Crt.Height = Crt.Height
    
    '���ۂ̃A�v���P�[�V�����̃^�C�g���ɕύX���ĉ�����
    MainForm.Caption = "�u�����̇@�@�u�����Q�[�v"
    '�t�H�[���̑傫�������C���̃s�N�`���{�b�N�X�ɍ��킹��
    MainForm.Width = (Crt.Width + 6) * Screen.TwipsPerPixelX
    MainForm.Height = (Crt.Height + 24) * Screen.TwipsPerPixelY
    
        
    
'�������܂ŁB
    
    '�����\���ʒu����ʏ�̃Z���^�[�ֈړ�
    If WindowState = 0 Then
        Move (Screen.Width - MainForm.Width) / 2, (Screen.Height - MainForm.Height) / 2
    End If
        
End Sub

Private Sub Form_Unload(Cancel As Integer)
'�A�v���P�[�V�����I������
    
    '�a�f�l�t�@�C�����N���[�Y����
    BGM_CLOSE
    End
    
End Sub
