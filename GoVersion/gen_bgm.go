package main

import (
	"encoding/binary"
	"math"
	"os"
)

func main() {
	const (
		sampleRate = 44100
		duration   = 2.0   // seconds
		frequency  = 220.0 // Hz (A3)
		amplitude  = 12000 // max 32767 for int16
	)
	nSamples := int(sampleRate * duration)
	data := make([]int16, nSamples)
	for i := 0; i < nSamples; i++ {
		t := float64(i) / sampleRate
		data[i] = int16(amplitude * math.Sin(2*math.Pi*frequency*t))
	}

	f, err := os.Create("bgm.wav")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	// Write WAV header
	f.Write([]byte("RIFF"))
	binary.Write(f, binary.LittleEndian, uint32(36+2*nSamples)) // file size - 8
	f.Write([]byte("WAVE"))
	f.Write([]byte("fmt "))
	binary.Write(f, binary.LittleEndian, uint32(16)) // PCM chunk size
	binary.Write(f, binary.LittleEndian, uint16(1))  // PCM format
	binary.Write(f, binary.LittleEndian, uint16(1))  // mono
	binary.Write(f, binary.LittleEndian, uint32(sampleRate))
	binary.Write(f, binary.LittleEndian, uint32(sampleRate*2)) // byte rate
	binary.Write(f, binary.LittleEndian, uint16(2))            // block align
	binary.Write(f, binary.LittleEndian, uint16(16))           // bits per sample
	f.Write([]byte("data"))
	binary.Write(f, binary.LittleEndian, uint32(2*nSamples))
	for _, v := range data {
		binary.Write(f, binary.LittleEndian, v)
	}
}
