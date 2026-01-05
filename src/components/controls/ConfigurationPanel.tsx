'use client';

import React from 'react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, Ruler, Zap, Layout } from 'lucide-react';

export default function ConfigurationPanel() {
  const { config, results, updateConfig, updatePeakConfig } = useLayoutStore();
  const isPeak = config.mode === 'peak';

  return (
    <div className="h-full bg-muted/40 border-r border-border flex flex-col w-96 overflow-y-auto">
      <div className="p-4 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold tracking-tight px-1">Govee Planner</h1>
          <p className="text-xs text-muted-foreground px-1">Pro Series / Perm. Outdoor Lights</p>
        </div>

        {/* --- SECTION 0: MODE TOGGLE --- */}
        <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => updateConfig({ mode: 'straight' })}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${!isPeak
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
              }`}
          >
            <Layout className="w-3 h-3" />
            Straight
          </button>
          <button
            onClick={() => updateConfig({ mode: 'peak' })}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${isPeak
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
              }`}
          >
            <Layout className="w-3 h-3 rotate-45" />
            Peak / Gable
          </button>
        </div>

        {/* --- GRID CONTAINER: DIMENSIONS & SUMMARY --- */}
        <div className="grid grid-cols-2 gap-2">

          {/* LEFT: DIMENSIONS */}
          <Card className="h-full">
            <CardHeader className="pb-2 p-3">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Ruler className="w-3 h-3" />
                Dims
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">

              {/* A. STRAIGHT MODE INPUTS */}
              {!isPeak && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase">Total Length</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={0}
                        suffix="ft"
                        className="px-2 py-1 h-8 text-sm"
                        value={config.runLengthFeet}
                        onChange={(e) => updateConfig({ runLengthFeet: Number(e.target.value) })}
                      />
                      <Input
                        type="number"
                        min={0}
                        suffix="in"
                        className="px-2 py-1 h-8 text-sm"
                        value={config.runLengthInches}
                        onChange={(e) => updateConfig({ runLengthInches: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Buffers Compact */}
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase">Start</Label>
                      <Input
                        type="number"
                        min={0}
                        suffix="in"
                        className="px-1 py-1 h-7 text-xs"
                        value={(config as any).startBuffer}
                        onChange={(e) => (updateConfig as any)({ startBuffer: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase">End</Label>
                      <Input
                        type="number"
                        min={0}
                        suffix="in"
                        className="px-1 py-1 h-7 text-xs"
                        value={(config as any).endBuffer}
                        onChange={(e) => (updateConfig as any)({ endBuffer: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* B. PEAK MODE INPUTS */}
              {isPeak && (
                <div className="space-y-2">
                  {/* Left Arm */}
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase">Left Slope</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={0}
                        suffix="ft"
                        className="px-2 py-1 h-7 text-xs"
                        value={config.peakConfig.leftLengthFt}
                        onChange={(e) => updatePeakConfig({ leftLengthFt: Number(e.target.value) })}
                      />
                      <Input
                        type="number"
                        min={0}
                        suffix="in"
                        className="px-2 py-1 h-7 text-xs"
                        value={config.peakConfig.leftLengthIn}
                        onChange={(e) => updatePeakConfig({ leftLengthIn: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Right Arm */}
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase">Right Slope</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={0}
                        suffix="ft"
                        className="px-2 py-1 h-7 text-xs"
                        value={config.peakConfig.rightLengthFt}
                        onChange={(e) => updatePeakConfig({ rightLengthFt: Number(e.target.value) })}
                      />
                      <Input
                        type="number"
                        min={0}
                        suffix="in"
                        className="px-2 py-1 h-7 text-xs"
                        value={config.peakConfig.rightLengthIn}
                        onChange={(e) => updatePeakConfig({ rightLengthIn: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Apex Config */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase">Apex</Label>
                      <Select
                        value={config.peakConfig.apexMode}
                        onChange={(e) => updatePeakConfig({ apexMode: e.target.value as any })}
                        className="h-7 text-xs py-0"
                      >
                        <option value="center">Center</option>
                        <option value="split">Split</option>
                      </Select>
                    </div>

                    {config.peakConfig.apexMode === 'split' && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] text-muted-foreground uppercase">Dist. from Peak</Label>
                          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {(config.peakConfig.apexGap / 2).toFixed(1)}"
                          </span>
                        </div>
                        <Slider
                          min={2}
                          max={(config as any).targetSpacing}
                          step={0.5}
                          value={config.peakConfig.apexGap / 2}
                          onChange={(e) => updatePeakConfig({ apexGap: Number(e.target.value) * 2 })}
                          className="py-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT: INSTALLATION PLAN settings moved here */}
          <Card className="bg-primary text-primary-foreground border-none shadow-md h-full">
            <CardHeader className="pb-2 p-3">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/90">
                <Zap className="w-3 h-3" />
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-primary-foreground/60 uppercase">Total Lights</span>
                <span className="font-mono font-bold text-xl leading-none">{results.totalLights}</span>
              </div>

              <div className="h-px bg-primary-foreground/10 my-1" />

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-primary-foreground/60 uppercase">Wire Slack</span>
                <span className={`font-mono font-bold text-sm leading-none ${(results.wireSlackAmount / 25.4) > 3 ? 'text-destructive-foreground' : ''}`}>
                  {(results.wireSlackAmount / 25.4).toFixed(2)}&quot;
                </span>
              </div>

              <div className="h-px bg-primary-foreground/10 my-1" />

              {!isPeak ? (
                <>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-primary-foreground/60 uppercase">Start Gap</span>
                    <span className="font-mono font-bold text-xs">{results.startGap.toFixed(2)}&quot;</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-primary-foreground/60 uppercase">End Gap</span>
                    <span className="font-mono font-bold text-xs">{results.endGap.toFixed(2)}&quot;</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-primary-foreground/60 uppercase">Left Eave Gap</span>
                    <span className="font-mono font-bold text-xs">{results.startGap.toFixed(2)}&quot;</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-primary-foreground/60 uppercase">Right Eave Gap</span>
                    <span className="font-mono font-bold text-xs">{results.endGap.toFixed(2)}&quot;</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- SECTION 2: LIGHT SPACING (Full Width Below) --- */}
        <Card>
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4 text-primary" />
              Light Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Target Spacing</Label>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {(config as any).targetSpacing}"
                </span>
              </div>
              <Slider
                min="2"
                max="19.5"
                step="0.5"
                value={(config as any).targetSpacing}
                onChange={(e) => (updateConfig as any)({ targetSpacing: Number(e.target.value) })}
              />
            </div>

            {/* Alignment Strategy (Straight Only) */}
            {!isPeak && (
              <div className="space-y-2">
                <Label>Alignment Strategy</Label>
                <Select
                  value={(config as any).alignmentStrategy}
                  onChange={(e) => (updateConfig as any)({ alignmentStrategy: e.target.value })}
                >
                  <option value="centric">Centric (Symmetrical)</option>
                  <option value="start-biased">Start Biased (Left)</option>
                  <option value="max-density">Max Density</option>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}