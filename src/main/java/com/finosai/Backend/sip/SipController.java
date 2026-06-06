package com.finosai.Backend.sip;

import com.finosai.Backend.sip.dto.SipRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sip")
public class SipController {

    private final SipService sipService;

    public SipController(
            SipService sipService) {

        this.sipService = sipService;
    }

    @PostMapping("/calculate")
    public SipResponse calculate(
            @RequestBody SipRequest request) {

        return sipService.calculateSip(
                request
        );
    }
}