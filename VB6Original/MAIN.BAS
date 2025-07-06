Attribute VB_Name = "メインモジュール"
    
'グローバル変数の定義

    '全般での変数
    Public CrtWidth     '表示画面用ピクチャボックスの幅設定
    Public CrtHeight    '表示画面用ピクチャボックスの高さ設定
    
    'ウェイト関係の変数
    Public 開始時間 As Long
    Public 終了時間 As Long
    Public 経過時間 As Long
    
    Public 実働時間 As Long

    'ＦＰＳ表示用変数
    Public Timer1 As Long, Timer2 As Long
    Public FPS As Integer
    
    Public Score As Long
    
    'ゲーム終了関係の変数
    Public EndFlag As Boolean  'ゲーム終了フラグ
    
    '自機の構造体変数の定義
    Type MyType
        X As Integer
        Y As Integer
        Pose As Integer
        Move As Integer
    End Type
    
    Public My As MyType
    Public X_Max As Integer, Y_Max As Integer
    
    '弾の構造体変数の定義
    Type ShotType
        X As Single     'Ｘ座標
        Y As Single     'Ｙ座標
        MoveX As Single 'Ｘ増加量
        MoveY As Single 'Ｙ増加量
        Flag As Boolean '存在フラグ
    End Type
    
    Public Shot(0 To 40) As ShotType
    Public ShotMax As Integer
    Public ShotCounter As Integer
    Public ShotAddCounter As Integer
    
Sub Main()
'
'このサブルーチンが実際に一番最初に走るプログラムです。
'

    'メインフォームを表示する
    CrtWidth = 32 * 8: CrtHeight = 32 * 8
    Load MainForm
    MainForm.Show
    
    'Exit Sub    'メインループを使用する場合この行を削除して下さい。
    
    '▼ここから実際のゲームプログラムを記述して下さい。
    
    GetAsyncKeyState (vbKeySpace)
    GetAsyncKeyState (vbKeyEscape)
    MainForm.Crt.BackColor = &HFF
    MainForm.Crt.Cls
    
    Do
    
        DoEvents
        
        If GetAsyncKeyState(vbKeySpace) Then
            'メインルーチンを実行
            MainRoutine
        End If
        
        'アプリケーション終了処理
        If GetAsyncKeyState(vbKeyEscape) Then
            'ループを抜ける
            Exit Do
        End If
    
    Loop
    
    '▲ここまで。
      
    End     '全ての処理が終了したらアプリケーションの終了
    
End Sub

Sub MainRoutine()
'メインルーチン

    '初期処理
    Const CycleTime = 30  '１サイクルの実行時間を設定
    EndFlag = 0
    
        
    '▼以下の部分に必要な初期処理を全て記述する。
    
    My.Move = 4
    My.X = (CrtWidth - 32) / 2
    My.Y = (CrtHeight - 32) / 2
    My.Pose = 0
    X_Max = CrtWidth - 32
    Y_Max = CrtHeight - 32
    
    Score = 0
    ShotMax = 4
    
    MainForm.Crt.BackColor = &H0
    
    For i = 0 To 40
        Shot(i).Flag = False
    Next i

    '▲ここまで。
    
    Do  '実際のループ
        
        'ループ開始時のタイムを記憶
        開始時間 = timeGetTime()
        
        '▼以下の部分にメインループでの仕事を記述する。
        
        ShotHappen
        ShotMove
        MyMove
        
        MainForm.Crt.Cls
        MyShow
        ShotShow
    
        ScoreShow
        
        '▲ここまで。
        
        'MainForm.Crt.Refresh
        DoEvents    '他の処理を実行
        
        'ゲーム終了処理
        If EndFlag Then
            'ループを抜ける
            Exit Do
        End If
        
        'ループ時間に関する処理
        終了時間 = timeGetTime()
        経過時間 = 終了時間 - 開始時間  '終了したタイムからかかったタイムを出す
        'ループした時間が短ければＷａｉｔ関数を呼び出し待つ
        If 経過時間 < CycleTime Then
            Wait (CycleTime - 経過時間)
        End If
        実働時間 = timeGetTime() - 開始時間

    Loop
    
    
End Sub
Sub MyMove()
    
    '自機移動処理
    Select Case Stick   'Ｓｔｉｃｋ関数によりカーソルキーの状態が帰って来ます
        
        Case 1  '上キー
            
            My.Pose = 0
            My.Y = My.Y - My.Move
            If My.Y <= 0 Then My.Y = 0
        
        Case 2  '右上キー
        
            My.Pose = 1
            My.X = My.X + My.Move: My.Y = My.Y - My.Move
            If My.X >= X_Max Then My.X = X_Max
            If My.Y <= 0 Then My.Y = 0
                        
        Case 3  '右キー
            
            My.Pose = 2
            My.X = My.X + My.Move
            If My.X >= X_Max Then My.X = X_Max
        Case 4  '右下キー
            
            My.Pose = 3
            My.X = My.X + My.Move: My.Y = My.Y + My.Move
            If My.X >= X_Max Then My.X = X_Max
            If My.Y >= Y_Max Then My.Y = Y_Max
                    
        Case 5  '下キー
            
            My.Pose = 4
            My.Y = My.Y + My.Move
            If My.Y >= Y_Max Then My.Y = Y_Max
        
        Case 6  '左下キー
            
            My.Pose = 5
            My.X = My.X - My.Move: My.Y = My.Y + My.Move
            If My.X <= 0 Then My.X = 0
            If My.Y >= Y_Max Then My.Y = Y_Max
        
        Case 7  '左キー
        
            My.Pose = 6
            My.X = My.X - My.Move
            If My.X <= 0 Then My.X = 0
            
        Case 8  '左上キー
            
            My.Pose = 7
            My.X = My.X - My.Move: My.Y = My.Y - My.Move
            If My.X <= 0 Then My.X = 0
            If My.Y <= 0 Then My.Y = 0
    
    End Select

End Sub
Sub MyShow()
    
    BitBlt MainForm.Crt.hDC, My.X, My.Y, 32, 32, MainForm.Chr.hDC, My.Pose * 32, 0, SrcPaint
    
End Sub
Sub ShotHappen()

    Dim F As Integer                    '１サイクル２度打ち防止変数
    Dim HappenX, HappenY As Integer     '弾の発生位置用変数
    Dim HappenRnd As Integer            '発生時使用する乱数格納用変数
    Dim Speed As Integer                '弾の移動量（速度）用変数
    Dim MovX As Single, MovY As Single, Mov As Single   '移動座標計算用変数
    
    '時間により最大発生する弾の数を増加していく
    '１００×サイクルタイムにて増加最大４０発まで
    If ShotAddCounter >= 100 And ShotMax < 40 Then
        ShotAddCounter = 0      '増加処理を行う為カウンターをクリア
        ShotMax = ShotMax + 1   '最大弾数を増加する
    Else
        ShotAddCounter = ShotAddCounter + 1 'カウント未到達時はカウンターインクル
    End If
    
    '弾の発生は４サイクルに一度とします
    If ShotCounter >= 4 Then
        ShotCounter = 0     '発生用のカウンターをクリア
        
        '弾の０～最大発生数まで繰り返します
        For i = 0 To ShotMax
            '弾構造体（ｉ）が存在してなくてこの発生サイクル中にまだ弾が発生していなければ実行
            If Shot(i).Flag = False And F = 0 Then
                
                'まず発生する方向を乱数にて作成（１～４）
                '１：左
                '２：上
                '３：右
                '４：下
                HappenRnd = Int((4 - 1 + 1) * Rnd + 1)
                
                '決定した方向別で初期出現座標を決定する
                Select Case HappenRnd
                    
                    Case 1  '画面左端の場合
                        
                        'Ｘ座標は左すみ固定
                        HappenX = 1
                        'Ｙ座標を乱数にて決定します
                        HappenY = Int((CrtHeight - 10 + 1) * Rnd + 10)
                        
                    Case 2  '画面上端の場合
                        
                        'Ｘ座標を乱数にて決定します
                        HappenX = Int((CrtWidth - 10 + 1) * Rnd + 10)
                        'Ｙ座標は上すみ固定
                        HappenY = 1
                        
                    Case 3  '画面右端の場合
                        
                        'Ｘ座標は右すみに固定
                        HappenX = CrtWidth - 10
                        'Ｙ座標を乱数にて決定します
                        HappenY = Int((CrtHeight - 10 + 1) * Rnd + 10)
                    
                    Case 4  '画面下端の場合
                        
                        'Ｘ座標を乱数にて決定します
                        HappenX = Int((CrtWidth - 10 + 1) * Rnd + 10)
                        'Ｙ座標は下すみで固定
                        HappenY = CrtHeight - 10
                    
                End Select
                
                Shot(i).Flag = True                         '弾構造体のフラグを存在にする
                Shot(i).X = HappenX: Shot(i).Y = HappenY    '作成した初期座標を代入する
                                
                '移動速度を乱数にて作成
                Speed = Int((2 - 1 + 1) * Rnd + 1)
                
                '自機と弾との距離を計算して作成
                'この時自機へ当らない弾も欲しい為乱数にて自機の座標を増減して
                '狙いの外れた弾を作成する
                MovX = My.X + 16 + Int((64 - 1 + 1) * Rnd + 1 - 32) - Shot(i).X
                MovY = My.Y + 16 + Int((64 - 1 + 1) * Rnd + 1 - 32) - Shot(i).Y
                
                '自機と弾との直線距離を算出する
                Mov = Sqr(MovX * MovX + MovY * MovY)
                
                'Ｘ、Ｙの距離を直線距離で割る事によって移動量を算出する事が出来る。
                Shot(i).MoveX = Speed * MovX / Mov
                Shot(i).MoveY = Speed * MovY / Mov
    
                F = 1   'この発生サイクルで弾が発生した事を意味します。
                
            End If
        
        Next i
        
    Else
    
        ShotCounter = ShotCounter + 1   '発生用カウンターをインクル
    
    End If
    
    
End Sub
Sub ShotMove()
    
    '最大弾数分ループする
    For i = 0 To ShotMax
    
        '存在フラグがＴｒｕｅなら実行
        If Shot(i).Flag = True Then
            
            '現在座標に増加量を加算する
            Shot(i).X = Shot(i).X + Shot(i).MoveX
            Shot(i).Y = Shot(i).Y + Shot(i).MoveY
            
            '自機との当り判定関数、及び弾が画面外に飛び出したら存在を消去する
            If ShotHitJudge(Int(Shot(i).X), Int(Shot(i).Y)) Or (Shot(i).X < 0 Or Shot(i).X > CrtWidth) Or (Shot(i).Y < 0 Or Shot(i).Y > CrtHeight) Then
                Shot(i).Flag = False
            End If
        
        End If
    
    Next i

End Sub
Function ShotHitJudge(AX, AY As Single) As Boolean

    '自機の座標と与えられたＡＸ及びＡＹ座標の当り判定
    If My.X < AX And My.X + 32 > AX And My.Y < AY And My.Y + 32 > AY Then
        
        '返り値をＴｒｕｅで設定
        ShotHitJudge = True
        
        '画面のバックカラーを赤に変更
        MainForm.Crt.BackColor = &HFF
        
        '画面を一度クリアする
        MainForm.Crt.Cls
        
        'ゲームオーバーフラグをセット
        EndFlag = True
        
        '再描画の為にＤｏｅｖｅｎｔｓを実行
        DoEvents
        
        '設定時間分待つ
        Wait 300
    
    End If
    
End Function

Sub ShotShow()
    
    '表示する際に座標をIntegerに直すのに使用
    Dim ShowX As Integer, ShowY As Integer
    
    '最大弾数分ループする
    For i = 0 To ShotMax
    
        '弾が存在していれば描画実行
        If Shot(i).Flag = True Then
            '座標を整数へ変換
            ShowX = Int(Shot(i).X): ShowY = Int(Shot(i).Y)
            '転送命令で弾を画面へ転送する
            BitBlt MainForm.Crt.hDC, ShowX, ShowY, 10, 10, MainForm.ShotPicture.hDC, 0, 0, SrcPaint
        End If
    
    Next i
    
End Sub
Sub ScoreShow()

    '画面左上にスコアを表示する。
    '※Printメソッドを利用すると勝手に描画処理を行う為その後
    '　Rifreshは行わなくて良い、逆に言うと必ず最後に実行しなければいけない
    
    If Timer1 < Timer2 And 実働時間 > 0 Then
        Timer1 = timeGetTime() + 250
        FPS = Int(1000 / 実働時間)
        Score = Score + 1
    Else
        Timer2 = timeGetTime()
    End If
    
    
    MainForm.Crt.CurrentX = 5: MainForm.Crt.CurrentY = 2
    MainForm.Crt.Print "FPS " & Format(FPS, "000") & Space(3) & "SCORE " & Format(Score, "000000")
    
End Sub

